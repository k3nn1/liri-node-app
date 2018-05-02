require("dotenv").config();
var keys = require("./keys");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var prompt = require("prompt");
var colors = require("colors/safe");
const util = require("util");

//----------For user inputs----------------------------
var userInput = "";
var userSelection = "";

// //----------user options-------------------
var myTweets = "myTweets";
var spotifySong = "spotifySong";
var movieThis = "movieThis";
var doWhatItSays = "do-what-it-says";

//---------setting up the prompts-----------------------

prompt.message = colors.red("myTweets, spotifySong, movieThis, do-what-it-says");
prompt.delimiter = colors.green("\n");

prompt.start();
prompt.get({
    properties: {
        userInput: {
            description: colors.blue("Type in one of the commands above")
        }
    }
}, function(err, result) {              // Function will run base on user's commands
        userInput = result.userInput;
        if (userInput === myTweets) {       // myTwitter
            // console.log("User Input: "+userInput)
            myTwitter();
            // console.log("Twt prompt User Selection: " + userSelection + " | " + userInput);
        } 
        else if (userInput === spotifySong) {       // Spotify
            prompt.get({
                properties: {
                    userSelection: {
                        description: colors.blue("Search for a song?")
                    }
                }
            }, function (err, result) {
                if (result.userSelection === "") {
                    userSelection = "Poker Face";
                    // console.log("prompt result: " + result);
                    // console.log("prompt User_Selection: " + userSelection);
                } 
                else {
                    userSelection = result.userSelection;
                    // console.log("prompt result: " + result);
                    // console.log(util.inspect(result, {showHidden: false, depth: null}))
                    // console.log("prompt User Selection: " + userSelection);
                    // console.log("prompt User Selection: " + result.userSelection);
                }
                mySpotify(userSelection);
                // console.log("Spotify prpt User Selection: " + userSelection);
            });
        } 
        else if (userInput === movieThis) {     // IMBD Movies
            prompt.get({
                properties: {
                    userSelection: {
                        description: colors.blue("Search a movie title?")
                    }
                }
            }, function(err, result) {
                if (result.userSelection === "") {
                    userSelection = "Terminator";
                }
                else {
                userSelection = result.userSelection;
                }
                myMovies(userSelection);
                // console.log("Movie prompt User Selection: " + userSelection);
            });
        } 
        else if (userInput === doWhatItSays) {      // This will read a random text in the .txt file
            doWhadeedee();
        };
    }
);

// ---------Twitter Function-------------------
function myTwitter() {
    var client = new Twitter(keys.twitter);
    // console.log("Client: " + client)

    var params = {screen_name: "scroopops"};
    // console.log("Params: " + params)
    
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if(!error) {
            for (var i = 0; i < tweets.length; i++) {
                    var tweetInfo = 
                        colors.blue("created: ") + tweets[i].created_at + "\n" +
                        colors.blue("Tweets: ") + tweets[i].text + "\n" +
                        colors.blue("---------------------------------------------\n");
                    
                    console.log(tweetInfo);
            };
        } else {
            console.log("Error: " + error); 
            // console.log("TWITTER: " + Twitter);
            return;
        }
    });
};

// // ==================== spotify debugging area ===========================
// // var songName = process.argv[2];
// // console.log(process.argv)

// // var params = songName;
// // var spotify = new Spotify(keys.spotify)

// // console.log("params: "+params)
// //     spotify.search({type:'track', query:params }, function(err, data) {
// //         console.log(data)
// // ==================================================================

// -------------Spotify Function-----------------------
function mySpotify(userSelection) {
    var spotify = new Spotify(keys.spotify)
    spotify.search({type: "track", query: userSelection}, function(err, data) {
        if (err) {
            console.log("ERROR: " + err);
            return;
        }
        // console.log("User Selection: " + userSelection);
        // console.log("DATA: " + data);
        // console.log(util.inspect(data, {showHidden: false, depth: null}))
        
        var song = data.tracks.items;
        for (var i = 0; i < song.length; i++) {
            var songInfo = 
                colors.green("Artist: ") + song[i].artists[0].name + "\n" +
                colors.green("Song Name: ") + song[i].name + "\n" +
                colors.green("A preview link of the song from Spotify: ") + song[i].preview_url + "\n" +
                colors.green("The album that the song is from: ") + song[i].album.name + "\n" +
                colors.green("--------------------------------------------------------------------------\n");

            console.log(songInfo);
        }
    });
};
    // })

// ----------------OMBD function ------------------
function myMovies(title) {
    
    var url = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy&r=json";
    request(url, function(error, response, body) {
        if (!error && response.statusCode ===200) {
            var movieJSON = JSON.parse(body);
            
            var movieInfo = 
                colors.yellow("Title: ") + movieJSON.Title + "\n" +
                colors.yellow("Year: ") + movieJSON.Year + "\n" +
                colors.yellow("IMBD Rating: ") + movieJSON.imbdRating + "\n" +
                colors.yellow("Rotten Tomatoes Rating: ") + movieJSON.tomatoRating + "\n" +
                colors.yellow("Country: ") + movieJSON.Country + "\n" +
                colors.yellow("Language: ") + movieJSON.Language + "\n" +
                colors.yellow("Plot: ") + movieJSON.Plot + "\n" +
                colors.yellow("Actors: ") + movieJSON.Actors + "\n" +
                colors.yellow("-----------------------------------------------------\n");
            
            console.log(movieInfo);
        };
    });    
};

// ----------------do what it says -------------------------
//----------- reading from .txtfile ------------------------
function doWhadeedee() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        var text = data.split(",");
        console.log(text);
        mySpotify(text[1]);
    })
}
