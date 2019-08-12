// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWp89ihORlivR6RwpILOZjGYwIgbRi5i0",
  authDomain: "trainscheduler-9a764.firebaseapp.com",
  databaseURL: "https://trainscheduler-9a764.firebaseio.com",
  projectId: "trainscheduler-9a764",
  storageBucket: "",
  messagingSenderId: "920535111700",
  appId: "1:920535111700:web:c218737467d4633e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let newName = $("<td>");
let newDest = $("<td>");
let newFreq = $("<td>");
let newArrival = $("<td>");
let newMinAway = $("<td>");

$(document).ready(function () {

  let addingTrain = function () {

    // stores user input from input field to variable
    let trainName = $("#trainNameForm").val().trim();
    let destination = $("#destinationForm").val().trim();
    let firstTime = $("#firstTimeForm").val().trim();
    let frequency = $("#frequencyForm").val().trim();

    // holds and labels the user input in a object
    let newTrain = {

      name: trainName,
      destination: destination,
      first_time: firstTime,
      frequency: frequency

    };

    // pushes the user input to the database
    database.ref("/trains").push(newTrain);

    // empties the input area after submitting new train
    $("#trainNameForm").val("");
    $("#destinationForm").val("");
    $("#firstTimeForm").val("");
    $("#frequencyForm").val("");

  };

  // after clicking the submit button, pushes user input to the database
  $("#addTrain").on("click", function (event) {

    event.preventDefault();

    addingTrain();

  });

  database.ref("/trains").on("child_added", function (childSnapshot) {

    // holds value of object in database
    const snapshotObj = childSnapshot.val();
    // holds current real time
    let currentTime = moment();
    // holds the name the user set from database
    let newTrainName = snapshotObj.name;
    // holds the destination the user set from database
    let newDestination = snapshotObj.destination;
    // takes in the first time the user set and converts it to military time
    let firstTrain = moment(snapshotObj.first_time, "HH:mm");
    // holds the frequency the user set from database
    let freq = snapshotObj.frequency;
    // takes the current time and compares it to the time the user set
    // than formats the difference in minutes
    let difference = currentTime.diff(firstTrain, "minutes");
    // takes the difference in minutes and used the modulus operator to determine
    // how many minutes are left over
    let remainder = difference % freq;
    // takes the users frequency and subtracts the remainder to determine
    // how many minutes away the next train is
    let minAway = freq - remainder;
    // takes the current time and adds the how many minutes away until the next
    // arrival is, than formats it into minutes
    let nextArr = currentTime.add(minAway, "minutes");

    // creates a new row with info from user
    let newTableRow = $("<tr>").append(

      newName.text(newTrainName),
      newDest.text(newDestination),
      newFreq.text(freq),
      newArrival.text(nextArr.format("LT")),
      newMinAway.text(minAway)

    );

    // appends the new row to the page
    $("#addedTrains").append(newTableRow);

  });

});