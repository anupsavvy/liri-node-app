var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js')

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var command = process.argv[2];

var playsong = function(song){
	spotify.search({ type: 'track', query: song }, function(err, data) {
   		if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}	

    	var details = data.tracks.items[0];
    	console.log("Song : ",details.name);
    	console.log("Preview : ",details.preview_url);
    	console.log("Album : ",details.album.name);
    	console.log("Artists : ",details.artists[0].name);
 
	});
}

var gettweets = function(){
	var params = {screen_name: 'asawant'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
  			var count = 0;
    		for (var tweet of tweets){
    			console.log(tweet.text);
    			count += 1;
    			if (count > 19){
    				break;
    			}
    		}
  		}
	});
}

var getmovie = function(title){
	var url = 'http://www.omdbapi.com/?t=' + title; 
	request(url, function (error, response, body) {
  		body = JSON.parse(body);
  		console.log("Title : ",body.Title);
  		console.log("Year : ",body.Year);
  		console.log("Rating : ",body.imdbRating);
  		console.log("Country : ",body.Country);
  		console.log("Language : ",body.Language);
  		console.log("Plot : ",body.Plot);
  		console.log("Actors : ",body.Actors);
	});
}

if (command === 'my-tweets'){
	gettweets();
}else if(command === 'spotify-this-song'){
	var song = process.argv[3];
	
	if(song === undefined){
		song = "'The Sign by Ace of Base";
	}

	playsong(song);
 	
	
}else if(command === 'movie-this'){
	var title = process.argv[3];
	getmovie(title);

}else if(command === 'do-what-it-says'){
	fs.readFile('random.txt','utf-8',function(err,data){
		if(!err){
			if(data.split(',')[0] === 'my-tweets'){
				gettweets();
			}else if(data.split(',')[0] === 'spotify-this-song'){
				playsong(data.split(',')[1]);
			}else if(data.split(',')[0] === 'movie-this'){
				getmovie(data.split(',')[1]);
			}
		}
	});
}
 
