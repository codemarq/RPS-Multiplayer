
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
  // UPDATE THIS SECTION!!!!!!-store these variables to the firebase!!
  // global game variables
  // Sets the choices 
  var choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

  // Declares the tallies to 0 
  var wins = 0;//player object. reference firebase player attr wins
  var losses = 0;
  var ties = 0;
  var currentPlayer = 0;//firebase====key to 2 players with different views
  //  add if statements (if currentplayer = 1, yada yada)
  var player = {};//firebase



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
    }
  }


  // messages to player windows

  // dynamically generate players

  // call giphs for results?

  // store data on firebase

  // enter player name function
  function startButton (event) {
    // prevent reload of page on enter key
    event.preventDefault();

    // DEFINE PLAYER OBJECT, current move, wins, loses

    // store playerName input to variable
    playerName = $('#playerName').val();
    /* ADD SOME CODE HERE TO STORE AS AN OBJECT AND PUSH TO FIREBASE
     *   Also need to define a method for determining player 1 or 2
     *  either by incrementing a variable or by session info
     */

    // clear playerName text box and replace with placeholder text. 
    // clear div
    $('#playerName').empty();
    // replace with placeholeder text
    $('#playerName').attr('placeholder', 'Name');
    // then hide the player input box and button
    $('#playerName').css('visibility', 'hidden');
    $('#startButton').css('visibility', 'hidden');


    // write html (overwrite player name in div)

    // write html 'Waiting on player 2' or 'Your Move!' 

    // render buttons
    renderButtons(currentPlayer);



  }

  // reload of window disconnects player and clears player from firebase
  // on disconnect function in firebase

  // chat window handler

  // write messages to chat window

  // chat message on-click
  function sendButton () {
    // target #chatInputText and append to playerName
    var chatMsg = playerName + $('#chatInputText').val();

    // append chat text to chat window

    // clear #chatInputText
    $('#chatInputText').empty();
  }
}

// waits for document ready to run javascript game function RPS
$(document).ready(rps);

// chat send button event listener
$('#chatButton').click(sendButton);

// click event listener
$('.rpsButton').click(rpsClick);

// start button event listener
$('#startButton').click(startButton);

