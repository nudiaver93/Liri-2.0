// Require fs to log usage of the app in a text file
var fs = require('fs');

// Require keys to access Twitter data
var keys = require('./keys');

// Require necessary packages for app functionality
var Twitter = require('twitter');
var Spotify = require('spotify');
var weather = require('weather-js');
var request = require('request');

// Require inquirer for user interaction
var inquirer = require('inquirer');

// Twitter functionality
function showTweets(twitterHandle, count){
		var user = new Twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret:  keys.twitterKeys.consumer_secret,
  			access_token_key: keys.twitterKeys.access_token_key,
  			access_token_secret: keys.twitterKeys.access_token_secret
  		});

  	user.get("statuses/user_timeline", {twitterHandle: twitterHandle, count: count}, function(error, tweets, response){
  		if (!error && response.statusCode == 200) {
  			for(var i = 0; i < tweets.length; i++){
  				console.log(twitterHandle);
  				console.log("Tweet: " + tweets[i].text + "\nDate: " + tweets[i].created_at);
  				console.log('\n');

  			}
  		} 
  		else {
  			console.log(error);
  		}
  	});
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
				fs.appendFile('log.txt', "\nOMDB Log" + "\nTitle: " + JSON.parse(body) ["Title"] + "\nYear: " + JSON.parse(body) ["Year"] + "\nActors: " + JSON.parse(body) ["Actors"] + "\nPlot: " + JSON.parse(body) ["Plot"] + "\nIMDB Rating: " + JSON.parse(body) ["imdbRating"]);
			} 
		});
	}; 
/*
// Weather functionality
function showWeather() {
		if(process.argv[3] === undefined) {
			var zip = '78705';
		}
		else {
			var zip = process.argv[3];
		};

	weather.find({search: zip, degreeType: 'F'}, function(err, result) {
		if (err) {
			console.log(err);
		}
		var response = JSON.stringify(result[0]["forecast"], null, 2);
		console.log(result);
	})

} */

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
}
]).then(function (user) {
	switch (user.choice) {
		case ("Spotify"):
			showSong(user.songTitle);
			break;
		case ("Movie"):
			showMovie(user.movieTitle);
			break;
	};
});