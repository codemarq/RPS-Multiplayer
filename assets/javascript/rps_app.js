
// Entire Game function
function rps () {
	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBvZTdpSqQ_BxYr50dRwcx0Zuf5TjTymQk",
    authDomain: "rpsmultiplayer-fb743.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-fb743.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  var database = firebase(database);

  // global game variables

  // click handlers

  // messages to player windows

  // dynamically generate players

  // call giphs for results?

  // store data on firebase

  // prevent reload of page
}

// waits for document ready to run javascript game function RPS
$(document).ready(rps);