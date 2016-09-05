
// Entire Game function
function rps () {
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
  // Sets the choices
  var choices = ['rock', 'paper', 'scissors']; 
  var rpsls = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

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
    currentPlayer: currentPlayer
  });
  
  var playerNumber = 0;
  

  // click handlers
  function rpsClick () {
    var userGuess = $(this).val();
    var otherGuess = 0;
    console.log(userGuess);
    userGuess++;

    decision = (userGuess - otherGuess) %2;

    // set timeout so that if player 2 does not enter in about 20seconds, 
    // then generate a modal to ask player 1 if they would like to play
    // against the computer. then set player2 == computerGuess.
    // This sets the computer guess equal to the random.
    var computerGuess = choices[Math.floor(Math.random() * choices.length)];

    // re-do the below game logic with modulo arithmetic.


    // Making sure the user chooses r, p, or s--
    if ((userGuess == 'r') || (userGuess == 'p') || (userGuess == 's')){

      // It tests to determine if the computer or the user won the round and then increments 
      if ((userGuess == 'r') && (computerGuess == 's')){
        wins++;
      }else if ((userGuess == 'r') && (computerGuess == 'p')){
        losses++;
      }else if ((userGuess == 's') && (computerGuess == 'r')){
        losses++;
      }else if ((userGuess == 's') && (computerGuess == 'p')){
        wins++;
      }else if ((userGuess == 'p') && (computerGuess == 'r')){
        wins++;
      }else if ((userGuess == 'p') && (computerGuess == 's')){
        losses++;
      }else if (userGuess == computerGuess){
        ties++;
      }  

      // Taking the tallies and displaying them in HTML
      var html = "<p>Press r, p or s to start playing</p>" +
      "<p>wins: " + 
      wins + 
      "</p>" +
      "<p>losses: " + 
      losses + 
      "</p>" +
      "<p>ties: " + 
      ties + 
      "</p>";

      // Placing the html into the game ID
      document.querySelector('#game').innerHTML = html;
    };

  };
  // UPDATE THIS SECTION (ABOVE)!!!

  // ===================================================

  // render buttons
  // Generic function for displaying movie data 
  function renderButtons(player){ 
    // passing in player argument to determine where to render buttons


    // Deletes the buttons prior to adding new buttons (this is necessary otherwise you will have repeat buttons)
    $('#buttonsView').empty();

    // Loops through the array of button choices
    for (var i = 0; i < choices.length; i++){

      // Then dynamicaly generates buttons for each attack choice in the array

        var a = $('<button>') // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
        a.addClass('choice'); // Added a class 
        a.attr('data-name', choices[i]); // Added a data-attribute
        a.text(choices[i]); // Provided the initial button text
        $('#buttonsView').append(a); // Added the button to the HTML
    };
  };


  // messages to player windows

  // dynamically generate players

  // store data on firebase
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
    console.log(snapshot.val().players);
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
      database.ref().update({'players': 1});
      playerNumber = 1;
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

  // click event listener
  $('.rpsButton').click(rpsClick);

  // start button event listener
  // $('#startButton').click(startButton);
};

// waits for document ready to run javascript game function RPS
$(document).ready(rps);

