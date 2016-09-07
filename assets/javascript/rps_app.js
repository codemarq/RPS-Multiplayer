$(document).ready(function() {
// Entire Game function
	// ========================================================
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBvZTdpSqQ_BxYr50dRwcx0Zuf5TjTymQk",
    authDomain: "rpsmultiplayer-fb743.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-fb743.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  // ========================================================
  // global game variables
  // Sets the rps
  var rps = ['Rock', 'Paper', 'Scissors']; 
  var rpsls = [
    Rock = {
      name: 'Rock',
      // value: Rock,
      Paper: 'Paper Covers Rock',
      Scissors: 'Rock smashes Scissors',
      Spock: 'Spock Vaporizes Rock',
      Lizard: 'Rock Crushes Lizard'
    }, 
    Paper = {
      name: 'Paper',
      // value: Paper,
      Scissors: 'Scissors Cut Paper',
      Spock: 'Paper disproves Spock',
      Lizard: 'Lizard eats Paper',
      Rock: 'Paper Covers Rock'
    },
    Scissors = {
      name: 'Scissors',
      // value: Scissors,
      Spock: 'Spock Smashes Scissors',
      Lizard: 'Scissors Decapitate Lizard',
      Rock: 'Rock smashes Scissors',
      Paper: 'Scissors cut paper'
    },   
    Spock = {
      name:'Spock',
      // value: Spock,
      Lizard: 'Lizard Poisons Spock',
      Rock: 'Spock vaporizes Rock',
      Paper: 'Paper disproves Spock',
      Scissors: 'Spock Smashes Scissors'
    },
    Lizard = {
      name: 'Lizard',
      // value: Lizard,
      Rock: 'Rock Smashes Lizard',
      Paper: 'Lizard eats Paper',
      Scissors: 'Scissors decapitate Lizard',
      Spock: 'Lizard poisons Spock'
    }];

  // keep track of number of players for game state
  // updated by the firebase "value" listener
  var currentPlayer = 0;//store in firebase
  var players = 0; // store in firebase
  var gameMessage = '';
  // local copy of firebase variables for player 1 game logic
  var player1 = {
    name: '',
    score: 0,
    choice: '',
  };
  // local copy of firebase variables for player 2 game logic
  var player2 = {
    name: '',
    score: 0,
    choice: '',
  };
  
  var choicesMade = 0;
  // set initial variables to firebase
  database.ref().set({
    players: players,
    currentPlayer: currentPlayer,
    choicesMade: choicesMade,
    // gameMessage: gameMessage
  });
  
  var playerNumber = 0;
  // ===================================================
   // click handlers
  function game (player1_choice, player2_choice) {

    var p1 = parseInt(player1_choice);
    var p2 = parseInt(player2_choice);
    var c = rpsls[p1];
    // var d = rpsls[p2].value;
    // console.log(d);
    

    var lose = [0, 3, -2, -4];
    var win = [2, 4, -1, -3];

    var outcome = (p1 + 1) - p2;
    console.log(outcome);

    if (outcome == 1) {
      // tie score
      // database.ref().update({'gameMessage': "<h3>Tie Game, you both chose " + c + "</h3>"});
      $('#gameMessage').html("Tie Game, you both chose " + c.name);   
    } 
    else if (($.inArray(outcome, lose)) != -1) {
      // if outcome is in lose array
      $('#gameMessage').html(rpsls[p1].d);
      player2.score ++;
      
    }
    else {
      // win
      $('#gameMessage').html(rpsls[p1].d);
      
      player1.score++;

    }

  };

  // render buttons
  function renderButtons(){ 
    // passing in player argument to determine where to render buttons
    if (playerNumber == 1) {
      var buttonsView = $('#player1_buttons')
    } else {
      var buttonsView = $('#player2_buttons')
    }

    // Deletes the buttons prior to adding new buttons (this is necessary otherwise you will have repeat buttons)
    buttonsView.empty();

    // Loops through the array of button rps
    for (var i = 0; i < rpsls.length; i++){

      // Then dynamicaly generates buttons for each attack choice in the array
        var a = $('<button>'); // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
        a.attr('value', [i]);
        a.addClass('choice button');
        a.addClass('btn btn-primary'); 
        a.attr('data-name', rpsls[i].name); // Added a data-attribute
        a.text(rpsls[i].name); // Provided the initial button text
        buttonsView.append(a); // Added the button to the HTML
    };
  };

  // button on click function
  function choice () {
    var choice = $(this).val();
    $('#gameMessage').empty();
    $('#gameMessage').html('<div><h3>You Chose ' + choice + '</h3><div>');
    $('#gameMessage').html("<div id='waiting'><h3>Waiting on other player</h3></div>");
    
    // update firebase
    if (playerNumber == 1) {
      database.ref().update({'player1_choice': choice});
      $('#player1_buttons').empty();
    } else { 
      database.ref().update({'player2_choice': choice});
      $('#player2_buttons').empty();
    };
    choicesMade++;
    database.ref().update({'choicesMade': choicesMade});

    console.log('player1: '+ player1.choice);
    console.log('player2: ' + player2.choice)
    // handling choices made
    if (choicesMade == 2) {
      game(player1.choice, player2.choice);
    }
  };

  // asynchronous listeners
  database.ref().on("value", function(snapshot) {
    // continuously update global variable "players" on users' page
    players = snapshot.val().players;
    player1.name = snapshot.val().player1_name;
    player1.score = snapshot.val().player1_score;
    player1.choice = snapshot.val().player1_choice;
    player2.name = snapshot.val().player2_name;
    player2.score = snapshot.val().player2_score;
    player2.choice = snapshot.val().player2_choice; 
    choicesMade = snapshot.val().choicesMade;
    // gameMessage = snapshot.val().gameMessage;

    $('#player1_name').html(snapshot.val().player1_name);
    $('#player2_name').html(snapshot.val().player2_name);
    $('#player1_score').html(snapshot.val().player1_score);
    $('#player2_score').html(snapshot.val().player2_score);
    // $('#gameMessage').html(snapshot.val().gameMessage);
    // error handling
  }), function (errorObject) {
    console.log("The read Failed: " + errorObject.code);
  };

  // enter player name function
  $('.startButton').on('click', function (event) {
    // prevent reload of page on enter key
    event.preventDefault(); 

    name = $('#nameInput').val().trim();
    // logic for which player you are
    if (players == 0) {
      // update players variables locally and on fb
      database.ref().update({
        'players': 1,
        'player1_name': name,
      });
      playerNumber = 1;

      // render player buttons and update game message
      renderButtons();
      $('#gameMessage').empty();
      $('#gameMessage').html('You can choose your move when ready');

    }
    else if (players == 1) {
      // sets players =2 in fb, which then updates local variable to 2
      database.ref().update({
        'players': 2,
        'player2_name': name,
      });    
      playerNumber = 2;  
      renderButtons();
      $('#gameMessage').empty();
      $('#gameMessage').html('You can choose your move when ready');
    };    

    // clear playerName text box and replace with placeholder text. 
    // clear div
    $('#nameInput').html('');
    // then hide the player input box and button
    $('#nameInput').css('visibility', 'hidden');
    $('#startButton').css('visibility', 'hidden');

    // render buttons
    renderButtons(currentPlayer);
  });

  // reload of window disconnects player and clears player from firebase
  // on disconnect function in firebase

  // =========================================================
  // chat window handler

  // write messages to chat window

  // chat message on-click
  function sendButton () {
    // target #chatInputText and append to playerName
    var chatMsg = playerName + $('#chatInputText').val();

    // append chat text to chat window
    $('#chatWindow').append(chatMsg);

    // clear #chatInputText
    $('#chatInputText').empty();
  };
  // chat send button event listener
  $('#chatButton').click(sendButton);
  
  // event listener RPS buttons
  $(document).on('click', '.choice', choice);
});



