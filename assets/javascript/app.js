// connection to Firebase DB
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
var queryURL =
  "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/CalculateDistance/ByZip?fromzipcode=80203&tozipcode=80210&key=DEMOAPIKEY";
var userzip = "";
var distances = [];
var maxDistance = "";
var users = [];
var userInput = 0;
var campaignName = "";
var customers = [];

// Takes in a zip code and distance
function determineDistance() {
  var updatedCustomers = [];
  var count = 0;
  database.ref("/customers").on("child_added", function(childSnapshot) {
    var customer = childSnapshot.val();
    var zip = customer.zip;
    var userzip = $("#user-zip")
      .val()
      .trim();
    var maxDistance = $("#max-distance")
      .val()
      .trim();
    var campaignName = $("#campaign-name")
      .val()
      .toUpperCase()
      .trim();

    $.ajax({
      url:
        "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/CalculateDistance/ByZip?fromzipcode=" +
        userzip +
        "&tozipcode=" +
        zip +
        "&key=1KD8MCQCP3U9ID1R4ETZ",
      method: "GET"
      // grabs customers according to zip code and distance
    }).done(function(response) {
      var results = response.DistanceInMiles;
      if (results <= maxDistance) {
        customer.distance = results;

        console.log(customer.email);

        var name = "Joseph";
        var email = customer.email;
        var customer_name = customer.fname; 

        // emails customers through Emailjs.com
        emailjs.init("user_vRXnWslIHFZMq1MSBb3XD");
        $("#emailButton").on("click", function(event) {
          event.preventDefault();

          var html = quill.root.innerHTML;
          console.log("content", html);
          var from = $("#from").val();
          console.log("from", from);
          var subject = $("#subject").val();
          console.log("subject", subject);
          $("#emailButton").html("Sending...");
          emailjs
            .send("jospehwilliamgj11_gmail_com", "template_sEGtEw5R", {
              from: from,
              to_email: email,
              from_name: "Jurassic Quest!",
              to_name: customer_name,
              subject: subject,
              message_html: html
            })
            .then(
              function() {
                $("#emailButton").html("Sent");
                console.log("Sent");
              },
              function(err) {
                alert(
                  "Send email failed!\r\n Response:\n " + JSON.stringify(err)
                );
              }
            );
        });
      }
    });
  });
}
$(document).on("click", "#new-campaign-button", function(event) {
  event.preventDefault();
  determineDistance();
  console.log("joe");
});

// //-------------------------------------------------------------
// //  Quill editor
// //-------------------------------------------------------------

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["link", "image", "video", "formula"],
  ["clean"] // remove formatting button
];
var quill = new Quill("#editor-container", {
  //debug: 'info',
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: "Compose an email here...",
  theme: "snow" // or 'bubble'
});
