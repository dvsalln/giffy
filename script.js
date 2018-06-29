// Array of topics
var topicArr = ["funny", "sad", "happy", "cute", "space",
"science", "kittens", "dogs", "summer", "bacon"];

// ----- Functions ----- //

// renderButtons will display our topic buttons for all topics within the
// topics array.
function renderButtons() {
  $("#buttonPanel").empty();

  // Loop through topic array
  for (var i = 0; i < topicArr.length; i++) {
    // Creates button for each topic
    var button = $("<button>");
    button.addClass("topicButton");
    button.attr("data-topic", topicArr[i]);
    button.text(topicArr[i]);

    // Add the button to the HTML
    $("#buttonPanel").append(button);
  }
}

// ----- Event Handlers ----- //

// An event handler for the user form to add additional topics to the array
$("#add-topic").on("click", function(event) {
  event.preventDefault();

  // Get the input from the textbox
  var topic = $("#topic-input").val().trim();

  // Adds new topic to topic array
  topicArr.push(topic);
  $("#topic-input").val("");

  renderButtons();
});

// fetchGifs will fetch animal Gifs with the Giphy API
function fetchTopicGifs() {
  // Gets name of topic from button click
  var topicName = $(this).attr("data-topic");
  var topicStr = topicName.split(" ").join("+");


  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topicStr + 
  "&rating=pg-13&limit=20&api_key=dc6zaTOxFJmzC";

  // AJAX call to the Giphy API
  $.ajax({
    method: "GET",
    url: queryURL,
  })
  .done(function( result ) {
    // Get the results array
    var dataArray = result.data;

    // Create and display div elements for each of the returned Gifs
    $("#gifPanel").empty();
    for (var i = 0; i < dataArray.length; i++) {
      var newDiv = $("<div>");
      newDiv.addClass("topicGif");

      var newRating = $("<h2>").html("Rating: " + dataArray[i].rating);
      newDiv.append(newRating);

      var newImg = $("<img>");
      newImg.attr("src", dataArray[i].images.fixed_height_still.url);
      newImg.attr("data-still", dataArray[i].images.fixed_height_still.url);
      newImg.attr("data-animate", dataArray[i].images.fixed_height.url);
      newImg.attr("data-state", "animate");
      newDiv.append(newImg);

      // Append the new Gifs to the gifPanel
      $("#gifPanel").append(newDiv);
    }
  });
}

// animateGif will animate a still Gif and stop a moving Gif
function animateGif() {
  // The image state will be either "still" or "animated"
  var state = $(this).find("img").attr("data-state");

  // Make the Gif either animated or still depending on the "data-state" value
  if (state === "animate") {
    $(this).find("img").attr("src", $(this).find("img").attr("data-still"));
    $(this).find("img").attr("data-state", "still");
  } else {
    $(this).find("img").attr("src", $(this).find("img").attr("data-animate"));
    $(this).find("img").attr("data-state", "animate");
  }
}

// Render the initial buttons when the HTML has finished loading
$(document).ready(function() {
  renderButtons();
});

// An event handler for the topic buttons to fetch appropriate Gifs
$(document).on("click", ".topicButton", fetchTopicGifs);

// Add an event handler for the topic Gifs to make the image animate and stop
$(document).on("click", ".topicGif", animateGif);
