require("dotenv").config();

var keys = require("./keys.js")
var Spotify = require("node-spotify-api")
var request = require("request")
var fs = require("fs")
var moment = require("moment")

var command = process.argv[2]
var input = process.argv.splice(3).join(" ");

pullData(command,input)

function pullData(type, input){
    switch (type){
        case "concert-this":
            concertThis(input)
            break;
        case "spotify-this-song":
            spotifyThis(input)
            break;
        case "movie-this":
            movieThis(input)
            break;
        case "do-what-it-says":
            doThat(input)
            break;

    }
}

function concertThis(input){
    var artist = input
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    request(url,function(error,response,body){
        //turn body into object
        var body = JSON.parse(body)

        //error results
        if(error){
            console.log("Error: " + error)
            console.log('statusCode:', response && response.statusCode);
        }
        //display event info
        console.log("\n" + artist + " is playing at the following venues!\n")
        for(var i = 0; i < body.length; i++){
            console.log('Venue:', body[i].venue.name);
            console.log('Location: ' + body[i].venue.city + ", " + body[i].venue.region + ", " + body[i].venue.country)

            var date = moment(body[i].datetime).format("MM-DD-YYYY")
            console.log("Event Date: " + date + "\n")
        }      
    })
}

function spotifyThis(input){
    var song
    if(!input){
        song = "The Sign"
    }
    else{
        song = input
    }

    var spotify = new Spotify(keys.spotify)
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (!err) {
            for (i = 0; i < data.tracks.items.length; i++) {
                var song = data.tracks.items[i];
                console.log('\nTitle: ' + song.name);
                console.log('Artist Name: ' + song.artists[0].name);
                console.log('Album Name: ' + song.album.name);
                console.log('Preview Link: ' + song.preview_url);
            }
        }
        else{
            console.log('Error occurred: ' + err)
        }
    })
}

function movieThis(input){
    var movie = input
    if(!input){
        movie = "Mr. Nobody"
    }
    else{
        movie = input
    }

    var url = "http://www.omdbapi.com/?apikey=trilogy&t="+ movie
    request(url,function(error,response,body){
        var movieData = JSON.parse(body)
        if(!error && response.statusCode === 200){
            console.log('\nTitle: ' + movieData.Title);
            console.log('Year: ' + movieData.Year);
            console.log('IMDB Rating: ' + movieData.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + movieData.Ratings[1].Value);
            console.log('Country: ' + movieData.Country);
            console.log('Language: ' + movieData.Language);
            console.log('Plot: ' + movieData.Plot)
            console.log('Actors: ' + movieData.Actors);
        }
        else{
            console.log("Error: " + error)
            console.log('statusCode:', response && response.statusCode);
        }
    })
}

function doThat(){
    fs.readFile("random.txt","utf8",function(err,data){
        if(!err){
            var array = data.split(",")
            pullData(array[0],array[1])
        }
        else{
            console.log("Error occurred while executing do-what-it-says")
        }
    });
}
