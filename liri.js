// Require fs to log usage of the app in a text file
var fs = require('fs');

// Require keys to access Twitter data
var keys = require('./keys/keys');

// Require necessary packages for app functionality
var Twitter = require('twitter');
var Spotify = require('spotify');
var weather = require('weather-js');
var request = require('request');

// Require inquirer for user interaction
var inquirer = require('inquirer');

// Twitter functionality
function postTweet(newTweet){
		var user = new Twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret:  keys.twitterKeys.consumer_secret,
  			access_token_key: keys.twitterKeys.access_token_key,
  			access_token_secret: keys.twitterKeys.access_token_secret
  		});

  		user.post('statuses/update', {status: newTweet}, function(error, tweet, response){
  			if (error) throw error;
  			var confirmation = "\nYour tweet, '" + newTweet + "', was successfully posted.";
  			console.log(confirmation)
  			fs.appendFile("log.txt", "\nTweet Log" + "\nTweet: " + newTweet + "\nCreated at: " + tweet["created_at"].substr(0, 11) + tweet["created_at"].substr(26, 4) + " " + tweet["created_at"].substr(11,9));
  		})	
 };

// Spotify functionality
function showSong(song) {
	if(song === undefined){
		var song = "What Is Love";
	} 
	Spotify.search({type: 'track', query: song, count: 1}, function(error, data){
		if(error) {
			console.log('Error:' + error);
			return;
		} 
		else{
			console.log("\nSong Name:" + data.tracks.items[0].name);
			console.log("\nArtist:" + data.tracks.items[0].artists[0].name);
			console.log("\nAlbum:" + data.tracks.items[0].album.name);
			console.log("\nPreview Link:" + data.tracks.items[0].preview_url);
			console.log();
			fs.appendFile('log.txt', "\nSpotify Log" + "\nArtist:" + data.tracks.items[0].artists[0].name + "\n" + "Song Name:" + data.tracks.items[0].name + "\n" + "Album Name" + data.tracks.items[0].album.name + "\n" + "Preview Link:" + data.tracks.items[0].preview_url+ "\n");
		}
	})
}; 

// OMDB Functionality 
function showMovie(movieTitle) {
	var OMDB = 'http://www.omdbapi.com/?t=' + movieTitle +'&y=&plot=long&tomatoes=true&r=json';
		request(OMDB, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("\nTitle: " + JSON.parse(body) ["Title"]);
				console.log("\nYear: " + JSON.parse(body) ["Year"]);
				console.log("\nActors: " + JSON.parse(body) ["Actors"]);
				console.log("\nPlot: " + JSON.parse(body) ["Plot"]);
				console.log("\nIMDB Rating: " + JSON.parse(body) ["imdbRating"]);
				console.log();
				fs.appendFile('log.txt', "\nOMDB Log" + "\nTitle: " + JSON.parse(body) ["Title"] + "\nYear: " + JSON.parse(body) ["Year"] + "\nActors: " + JSON.parse(body) ["Actors"] + "\nPlot: " + JSON.parse(body) ["Plot"] + "\nIMDB Rating: " + JSON.parse(body) ["imdbRating"] + "\n");
			} 
		});
	}; 

// Weather functionality
function showWeather(zip) {
	weather.find({search: zip, degreeType: 'F'}, function(err, result) {
		if (err) {
			console.log(err);
		}
		// Make the response 
		var response = JSON.stringify(result[0]["forecast"], null, 2);
		console.log(response);
		fs.appendFile('log.txt', "\nWeather log" + "\nForcast in " + zip + "\n" + response + "\n")
	})

} 

function game() {
	console.log("\nThe Hangman functionality will be coming soon.\nGoodbye!\n")
}
console.log("Hello, and welcome to LIRI.")
console.log("===========================")
inquirer.prompt([
{
	type: "list",
	message: "What app would you like to use?",
	choices: ["Spotify", "Twitter", "Movie", "Weather", "I want to play a game instead."], 
	name: "choice"

},

{
	type: "input",
	message: "What song would you like to look up?",
	name: "songTitle",
	when: function(answers){
		return answers.choice === "Spotify";
	}
},
{
	type: "input",
	message: "What movie would you like to look up?",
	name: "movieTitle",
	when: function(answers) {
		return answers.choice === "Movie";
	}
}, 
{
	type: "input",
	message: "What zip code you would like to look up weather information for?",
	name: "zip",
	when: function(answers) {
		return answers.choice === "Weather";
	}
}, 
{
	type: "input",
	message: "What would you like to post on Twitter?",
	name: "newTweet",
	when: function(answers) {
		return answers.choice === "Twitter";
	}
}, 
{
	type: "confirm",
	message: "Would you like to play NBA hangman?",
	name: "hangman",
	when: function(answers) {
		return answers.choice === "I want to play a game instead.";
	}
}
]).then(function (user) {
	switch (user.choice) {
		case ("Spotify"):
			showSong(user.songTitle);
			break;
		case ("Movie"):
			showMovie(user.movieTitle);
			break;
		case ("Weather"):
			showWeather(user.zip);
			break;
		case ("Twitter") :
			postTweet(user.newTweet);
			break;
		case ("I want to play a game instead."):
			if (user.hangman === true){
				game();
			}
			break;
	};
});