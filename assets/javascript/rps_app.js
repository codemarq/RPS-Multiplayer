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
  // Sets the rpsls
  var rpsls = [
    Rock = {
      name: 'Rock',
      // responses-i know there is a better way than repeating
      // this code but i ran out of time
      response: ['Tie', 'Paper Covers Rock', 'Rock smashes Scissors', 'Spock Vaporizes Rock', 'Rock Crushes Lizard']
    }, 
    Paper = {
      name: 'Paper',
      response: ['Paper Covers Rock', 'Tie', 'Scissors Cut Paper', 'Paper disproves Spock', 'Lizard eats Paper',]
    },
    Scissors = {
      name: 'Scissors',
      response: ['Rock smashes Scissors', 'Scissors cut paper', 'Tie', 'Spock Smashes Scissors', 'Scissors Decapitate Lizard',]
    },   
    Spock = {
      name:'Spock',
      response: ['Spock vaporizes Rock', 'Paper disproves Spock', 'Spock Smashes Scissors', 'Tie', 'Lizard Poisons Spock']
    },
    Lizard = {
      name: 'Lizard',
      response: ['Rock Smashes Lizard', 'Lizard eats Paper', 'Scissors decapitate Lizard', 'Lizard poisons Spock', 'Tie']
    }];

  // keep track of number of players for game state
  var currentPlayer = 0;
  var players = 0; 
  
  // local copy of firebase variables for player 1 game logic
  var player1 = {
    name: '',
    score: 0,
    choice: '',
    chatMsg: ''
  };
  // local copy of firebase variables for player 2 game logic
  var player2 = {
    name: '',
    score: 0,
    choice: '',
    chatMsg: ''
  };
  
  var choicesMade = 0;
  // set initial variables to firebase
  database.ref().set({
    players: players,
    choicesMade: choicesMade,
  });
  
  var playerNumber = 0;
  // ===================================================
   // click handlers
  function game (player1_choice, player2_choice) {

    var p1 = parseInt(player1_choice);
    var p2 = parseInt(player2_choice);

    // win/lose messages handled by player object
    gameMessage = rpsls[p1].response[p2];
    $('#gameMessage').html(gameMessage);

    // win/lose logic for scoring
    var lose = [0, 3, -2, -4];
    // var win = [2, 4, -1, -3];
    var outcome = (p1 + 1) - p2; 

    if (outcome == 1) {
      // tie
      $('#gameMessage').html("Tie Game, you both chose " + rpsls[p1].name);   
    } 
    else if (($.inArray(outcome, lose)) != -1) {
      // p1 lose
      player2.score ++;
      $('#player2_score').html("<h2>Score: " + player2.score + "</h2>");
    }
    else {
      // p1 win
      player1.score++;
      $('#player1_score').html("<h2>Score: " + player1.score + "</h2>");    
    }
    choicesMade = 0;
    database.ref().update({'choicesMade': choicesMade});
    setTimeout(function() {renderButtons();}, 2000);
  }

  // render buttons
  function renderButtons(){ 
    // passing in player argument to determine where to render buttons
    if (playerNumber == 1) {
      buttonsView = $('#player1_buttons');
    } else {
      buttonsView = $('#player2_buttons');
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
    }
  }

  // button on click function
  function choice () {
    var choice = $(this).val();
    var choiceName = $(this).data('name');

    $('#gameMessage').empty();
    $('#gameMessage').html('<div><h3>You Chose ' + choiceName + '</h3><div>');
    // $('#gameMessage').html("Waiting on other player");
    
    // update firebase
    if (playerNumber == 1) {
      database.ref().update({'player1_choice': choice});
      $('#player1_buttons').empty();
    } else { 
      database.ref().update({'player2_choice': choice});
      $('#player2_buttons').empty();
    }
    choicesMade++;
    database.ref().update({'choicesMade': choicesMade});    
  }
  
 
  // asynchronous listeners
  database.ref().on("value", function(snapshot) {
    // continuously update global variable "players" on users' page
    players = snapshot.val().players;
    player1.name = snapshot.val().player1_name;
    player1.choice = snapshot.val().player1_choice;
    player2.name = snapshot.val().player2_name;
    player2.choice = snapshot.val().player2_choice; 
    choicesMade = snapshot.val().choicesMade;
    
    // when both players choose, run game
    if (choicesMade == 2) {
      game(player1.choice, player2.choice);
    }

    $('#player1_name').html(snapshot.val().player1_name);
    $('#player2_name').html(snapshot.val().player2_name);
    $('#player1_score').html(snapshot.val().player1_score);
    $('#player2_score').html(snapshot.val().player2_score);
    $('#chatWindow').append(snapshot.val().player1_chat);
    $('#chatWindow').append(snapshot.val().player2_chat);

    // error handling
    }), function (errorObject) {
      console.log("The read Failed: " + errorObject.code);
  };

  // enter player name function
  $('.startButton').on('click', function (event) {
    // prevent reload of page on enter key
    event.preventDefault(); 

    playerName = $('#nameInput').val().trim();
    // logic for which player you are
    if (players === 0) {
      // update players variables locally and on fb
      database.ref().update({
        'players': 1,
        'player1_name': playerName,
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
        'player2_name': playerName,
      });    
      playerNumber = 2;  
      renderButtons();
      $('#gameMessage').empty();
      $('#gameMessage').html('You can choose your move when ready');
    }    

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
 
  // chat message on-click
  function sendButton (event) {
    event.preventDefault();
    // target #chatInputText and append to playerName
    var chatMsg = playerName + ': ' + $('#chatInputText').val() + '<br>';

    // append chat text to firebase
    if (playerNumber == 1) {
      database.ref().update({'player1_chat': chatMsg});
    } else {
      database.ref().update({'player1_chat': chatMsg});
    }

    // clear #chatInputText
    $('#chatInputText').val('');
  }


  // chat send button event listener
  $('#chatButton').click(sendButton);
  
  // event listener RPS buttons
  $(document).on('click', '.choice', choice);
});



