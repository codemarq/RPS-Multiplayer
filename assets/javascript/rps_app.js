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
  var rpsls = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

  // keep track of number of players for game state
  // updated by the firebase "value" listener
  var currentPlayer = 0;//store in firebase
  var players = 0; // store in firebase
  
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
  
  // set initial variables to firebase
  database.ref().set({
    players: players,
    currentPlayer: currentPlayer,
    choicesMade: 0
  });
  
  var playerNumber = 0;
  // ===================================================
   // click handlers
  function game (player1_choice, player2_choice) {

    var p1 = rps.indexOf(player1_choice);
    var p2 = rps.indexOf(player2_choice);
    console.log('p1: ' + p1);
    console.log('p2: ' + p2);

  };

  // render buttons
  function renderButtons(){ 
    // passing in player argument to determine where to render buttons
    if (playerNumber == 1) {
      var buttonsView = $('#playerOneButtons')
    } else {
      var buttonsView = $('#playerTwoButtons')
    }

    // Deletes the buttons prior to adding new buttons (this is necessary otherwise you will have repeat buttons)
    buttonsView.empty();

    // Loops through the array of button rps
    for (var i = 0; i < rps.length; i++){

      // Then dynamicaly generates buttons for each attack choice in the array

        var a = $('<button>'); // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
        a.attr('value', rps[i]);
        a.attr('id', 'rendered');
        a.addClass('choice button');
        a.addClass('btn btn-primary'); 
        a.attr('data-name', rps[i]); // Added a data-attribute
        a.text(rps[i]); // Provided the initial button text
        buttonsView.append(a); // Added the button to the HTML
    };
  };

  // button on click function
  function choice () {
    var choice = $(this).attr('value');
    $('#gameMessages').empty();
    $('#gameMessages').html('<div><h3>You Chose ' + choice + '</h3><div>');
    $('#gameMessages').html("<div id='waiting'><h3>Waiting on other player</h3></div>");
    
    // update firebase
    if (playerNumber == 1) {
      database.ref().update({'player1_choice': choice});
    } else { 
      database.ref().update({'player2_choice': choice});
    };
    database.ref().update({'choicesMade': 1});
    // handling choices made
    // if (database.ref().choicesMade == 0) {
      
    // } else {
    //   game(player1.choice, player2.choice);
    // }
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

    // error handling
  }), function (errorObject) {
    console.log("The read Failed: " + errorObject.code);
  };

  //  firebase watcher -- writes data to screen on value changes
  database.ref().on("child_added", function (childSnapshot) {
    // write firebase data changes to screen
    $('#player1_name').html(childSnapshot.val().player1_name);
    $('#player2_name').html(childSnapshot.val().player2_name);
    
    // Handle the errors
  }, function (errorObject) {
    // handles errors:
    console.log("Errors Handled: " + errorObject.code)
  });

  // enter player name function
  $('.startButton').on('click', function (event) {
    // prevent reload of page on enter key
    event.preventDefault(); 

    name = $('#nameInput').val().trim();
    // logic for which player you are
    if (players == 0) {
      database.ref().push({
        'player1_name': name,
        'player1_number': 1,
        'player1_choice': '',
        'player1_score': 0
      });
      // update players variables locally and on fb
      database.ref().update({'players': 1});
      playerNumber = 1;

      // render player buttons and update game message
      renderButtons();
      $('#gameMessages').empty();
      $('#gameMessages').html('<h3>You can choose your move when ready</h3>');

    }
    else if (players == 1) {
      console.log('player2.name: ' + name);
      database.ref().push({
        'player2_name': name,
        'player2_number': 2,
        'player2_choice': '',
        'player2_score': 0
      })
      // sets players =2 in fb, which then updates local variable to 2
      database.ref().update({'players': 2});    
      playerNumber = 2;  
      renderButtons();
      $('#gameMessages').empty();
      $('#gameMessages').html('<h3>You can choose your move when ready</h3>');
    };    

    // clear playerName text box and replace with placeholder text. 
    // clear div
    $('#nameInput').html('');
    // then hide the player input box and button
    $('#nameInput').css('visibility', 'hidden');
    $('#startButton').css('visibility', 'hidden');


    // write html (overwrite player name in div)

    // write html 'Waiting on player 2' or 'Your Move!' 

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

    // clear #chatInputText
    $('#chatInputText').empty();
  };
  // chat send button event listener
  $('#chatButton').click(sendButton);

  // start button event listener
  // $('#startButton').click(startButton);
  
  // event listener RPS buttons
  $(document).on('click', '.choice', choice);
});



