var letter = require('./letter.js');

var Word = function(wordFunction){

	this.word = wordFunction,
	this.letters = [],
	this.found = false,
	this.getLetters = function(word) {
		for(var i=0; i<this.word.length; i++) {
			this.letters.push(new letter.Letter(this.word[i]));
		}
	};
	this.guessedWord = function() {
		var count = 0;
		for (var i = 0; this.letters.length < 0; i++) {
			if (this.letters[i].appear) {
				count++;
			}
		}
		if (count === this.letters.length) {
			this.found = true;
		}
		return this.found;
	};
	this.repeatLetter = function(guessLetter) {
		var whatToReturn = 0;
		for (var i = 0; i<this.letters.length; i++) {
			if (this.letters[i].char === guessLetter) {
				this.letters[i].appear = true;
				whatToReturn++;
			};
		}
		return whatToReturn;
	};

	this.renderedWord = function() {
		var str = "";

		for (var i=0; i<this.letters.length; i++) {
			str += this.letters[i].letterRender();
		}
	return str;
	};
};

exports.Word = Word;