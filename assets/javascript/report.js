var config = {
  apiKey: "AIzaSyAYcEFQz7-dPSlnRzDkHOmkyoh53zWwab4",
  authDomain: "dinotech-42ff0.firebaseapp.com",
  databaseURL: "https://dinotech-42ff0.firebaseio.com",
  projectId: "dinotech-42ff0",
  storageBucket: "",
  messagingSenderId: "1029126190429"
};
firebase.initializeApp(config);

var database = firebase.database();
//for campaigns report.  When select a campaign in the drop down and hit report it will change the values in the grid display of emails sent by that campaign
$(document).on("click", "#campaign-list-button", function(event) {
  event.preventDefault();
  $("tBody").empty();
  var campaignReport = $("#campaign-drop")
    .val()
    .toUpperCase()
    .trim();

  database
    .ref("/customers")
    .orderByChild("lname")
    .on(
      "child_added",
      function(childSnapshot) {
        var zipCreport = 0;
        var fnameCreport = " ";
        var lnameCreport = " ";
        var emailCreport = " ";
        var tBody = $("tbody");
        var tRow = $("<tr>");
        //output to the console for debugging
        console.log(childSnapshot.val().zip);
        console.log(childSnapshot.val().fname);
        console.log(childSnapshot.val().lname);
        console.log(childSnapshot.val().email);
        var campaignDatabase = childSnapshot.val().campaignName;
        console.log("campaignDatabase: ", campaignDatabase);
        console.log("campaignReport: ", campaignReport);

        //if the campaign in the database record equals to the dropdown selected campaign on the html page output the data to the grid on the html.
        if (campaignReport === campaignDatabase) {
          // full list of items to the well
          var zipCreport = $("<td>").text(childSnapshot.val().zip);
          var fnameCreport = $("<td>").text(childSnapshot.val().fname);
          var lnameCreport = $("<td>").text(childSnapshot.val().lname);
          var emailCreport = $("<td>").text(childSnapshot.val().email);
          //appends rows
          tRow.append(zipCreport, fnameCreport, lnameCreport, emailCreport);
          // appends rows to body
          tBody.append(tRow);
        }

        // Handle the errors
      },
      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
});

// this populates the drop down with the current distinct campaign cities in the available report drop down from firebase.

var campaignArray = [];
database.ref("/customers").on("value", function(childSnapshot) {
  var firebaseobject = childSnapshot.val();
  console.log("firebaseobject: ", firebaseobject);
  console.log(" childsnapshot: ", childSnapshot.val());
  //creates an array of all the Campaign Names from firebase
  for (eventcampaign in firebaseobject) {
    console.log(firebaseobject[eventcampaign].campaignName);
    var cityName = firebaseobject[eventcampaign].campaignName;
    if (campaignArray.includes(cityName)) {
      continue;
    } else {
      campaignArray.push(cityName);
    }
  }
  //dynamically creates the options in the available dropdown for report creation
  for (var i = 0; i < campaignArray.length; i++) {
    var city = $("<option>").text(campaignArray[i]);
    $("#campaign-drop").append(city);
  }
  console.log("campaignArray: ", campaignArray);
});
