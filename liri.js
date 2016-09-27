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
			console.log("Song Name:" + data.tracks.items[0].name);
			console.log("Artist:" + data.tracks.items[0].artists[0].name);
			console.log("Album:" + data.tracks.items[0].album.name);
			console.log("Preview Link:" + data.tracks.items[0].preview_url);
			fs.appendFile('random.txt', "Artist:" + data.tracks.items[0].artists[0].name + "\n" + "Song Name:" + data.tracks.items[0].name + "\n" + "Album Name" + data.tracks.items[0].album.name + "\n" + "Preview Link:" + data.tracks.items[0].preview_url+ "\n");
		}
	})
}; 

// OMDB Functionality 

function showMovie(movieTitle) {
	var OMDB = 'http://www.omdbapi.com/?t=' + movieTitle +'&y=&plot=long&tomatoes=true&r=json';
		request(OMDB, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("Title:" + JSON.parse(body) ["Title"]);
				console.log("\nYear:" + JSON.parse(body) ["Year"]);
				console.log("\nIMDB Rating:" + JSON.parse(body) ["imdbRating"]);
				console.log("\nCountry:" + JSON.parse(body) ["Country"]);
				console.log("\nLanguage:" + JSON.parse(body) ["Language"]);
				console.log("\nPlot:" + JSON.parse(body) ["Plot"]);
				console.log("\nActors:" + JSON.parse(body) ["Actors"]);
				console.log("\nRotten Tomatoes Rating:" + JSON.parse(body) ["rottenTomatoesRating"]);
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
	message: "What would you like to look up?",
	choices: ["Spotify", "Twitter", "Movie", "Weather", "I want to play a game instead."], 
	name: "choice"

}]).then(function (user) {
	switch (user.choice) {
		case "Twitter":
			inquirer.pronpt([
			{
				type: "input",
				message: "What movie would you like to look up?",
				name: "movieTitle"
			}]).then(function (user) {
				showMovie(user.movieTitle);
			});
			break;
	}
	/*
	if (user.choice === "Spotify") {
		inquirer.prompt([
		{
			type: "input",
			message: "What song would you like to look up?",
			name: "song",
		}]).then(function(user) {
			showSong(user.song);
		});
	*/
	/*if (user.choice === "Twitter") {
		inquirer.prompt([
		{
			type: "input",
			message: "What is the Twitter Handle you would like to look up?",
			name: "twitterHandle"
		},

		{
			type: "list",
			message: "How many tweets would you like to look up?",
			choices: ["5", "10", "25", "50"],
			name: "count"
		}]).then(function(user){
			var count = parseInt[user.count];
			showTweets(user.twitterHandle, count);
		});*/
		
});