var keys = require('./keys.js');
var inquirer = require('inquirer');
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');  
var fs = require('fs');

var lookup = {
    twitterApi: function(){
        var client = new Twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret 
        })

        client.get('search/tweets.json?q=from%3AFugioElGordo&result_type=recent&count=20', function(err, tweets, response){
            if(err) throw err;
            
            console.log("Your last " + tweets.statuses.length + " tweets")
            console.log("************************************")
            for(var i = 0; i < tweets.statuses.length; i++){
                
                var date = new Date(JSON.stringify(tweets.statuses[i].created_at));
                console.log("Content: " + tweets.statuses[i].text)
                console.log("************************************")
            }
        })

    },
    spotifyApi: function(song){
        var spotify = new Spotify({
            id: keys.spotifyKeys.id,
            secret: keys.spotifyKeys.secret
        });

        spotify
            .search({type: 'track', query: song})
            .then(function(response){
                var artist;

                for (var i = 0; i < response.tracks.items[0].artists.length; i++){
                    if(i > 0){
                        artist += ", " + response.tracks.items[0].artists[i].name;
                    } else {
                        artist = "Artist(s): " + response.tracks.items[0].artists[i].name;
                    }
                }
                console.log("*******************************")
                console.log(artist);
                console.log("Song Title: " + response.tracks.items[0].name);
                console.log("Preview URL: " + response.tracks.items[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);
                console.log("*********************************")

            });
            
    },
    movie: function(mov){
        var reqUrl = "http://omdbapi.com/?t=" + mov + "&apikey=40e9cece";
        request.get(reqUrl,function(err, response, body){
            if(err){
                console.log(err);
            }
            var convert = JSON.parse(body);
            console.log("==============================")
            console.log("Movie Title: " + convert.Title);
            console.log("Release Date: " + convert.Year);
            console.log("Movie Title: " + convert.Title);
            console.log("IMDB Rating: " + convert.Ratings[0].Value);
            console.log("Country Where Produced: " + convert.Country);
            console.log("language: " + convert.Language);
            console.log("Movie Plot: " + convert.Plot);
            console.log("Actors: " + convert.Actors);    
            console.log("Rotten Tomatoes URL: " + convert.Language);   
        })

    },
    doWhatItSays: function(){
        fs.readFile('random.txt', 'utf8', function(err, data){

            if(err){
                console.log(err);
            }
            var text = [];
            text = data.split(",");
            console.log(data)
            })
    }
}


inquirer.prompt({
    type: "list",
    message: "What would you like to do?",
    choices: ["Tweets","Spotify Search", "Movie Lookup", "Or, whatever?" ],
    name: "choice"

}).then(function(user){
    switch(user.choice){
        case "Tweets":
            lookup.twitterApi();
            break;
        case "Spotify Search":
            inquirer.prompt({
                type: "input",
                message: "Song Name?",
                name: "song"
            }).then(function(choice){
                console.log("spotify-this-song \"" + choice.song + "\"")
                console.log("Running lookup on \"" + choice.song + "\"");
                lookup.spotifyApi(choice.song);
            })
            break;
        case "Movie Lookup":
            inquirer.prompt({
                type: "input",
                message: "Movie Name?",
                name: "movie"
            }).then(function(choice){
                if(choice.movie === ""){
                    lookup.movie("Mr Nobody")
                } else {
                    lookup.movie(choice.movie);
                }
            })
            break;
        case "Or, whatever?":
            lookup.doWhatItSays();
            break;
        default:
            break;
    }
})