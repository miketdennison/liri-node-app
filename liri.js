////////////////////////////////////////////
// Required Files & Libraries
////////////////////////////////////////////
require("dotenv").config(); // User must provide their own
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require('node-spotify-api');
const moment = require("moment");
const fs = require("fs");
const fileName = "random.txt";
const logFile = "log.txt";

//////////////////////////////////////////////
// API Keys
//////////////////////////////////////////////
const spotify = new Spotify(keys.spotify);

////////////////////////////////////////////
// Commandline Arguments
////////////////////////////////////////////
var argument = process.argv;
var command = process.argv[2];
var queryArg = sanitizeData();

////////////////////////////////////////////
// Sanitize Data if user provides > 2 arguments
////////////////////////////////////////////
function sanitizeData() {
    if (command !== "spotify-this-song") {
        return argument.slice(3).join("+");
    } else {
        return argument.slice(3).join(" ");
    }
}

////////////////////////////////////////////
// Process user input from commandline
////////////////////////////////////////////
function processInput(input = command) {
    if (input === "concert-this") {
        queryBandsInTown();
    } else if (input === "spotify-this-song") {
        querySpotify();
    } else if (input === "movie-this") {
        queryOmdb();
    } else if (input === "do-what-it-says") {
        processRandomTxt();
    } else {
        console.log("Invalid selection");
        fs.appendFileSync(logFile, "Invalid selction\n");
    }
}

////////////////////////////////////////////
// Query the Bands In Town API for concert info
////////////////////////////////////////////
function queryBandsInTown() {
    var queryURL =
        "https://rest.bandsintown.com/artists/" + queryArg + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
            function (response) {
                if (response) {
                    var event = response.data[0];
                    console.log("Venue:    " + event.venue.name);
                    console.log("Location: " + event.venue.city + ", " + event.venue.region);
                    console.log("Date:     " + moment(event.datetime).format("LLL"));
                    fs.appendFileSync(logFile, "Venue:    " + event.venue.name + "\n");
                    fs.appendFileSync(logFile, "Location: " + event.venue.city + ", " + event.venue.region + "\n");
                    fs.appendFileSync(logFile, "Date:     " + moment(event.datetime).format("LLL") + "\n");
                    
                }
            })
        .catch(function (error) {
            console.log(error);
            fs.appendFileSync(logFile, err + "\n");
        });
}

////////////////////////////////////////////
// Query the Spotify API for artist info
////////////////////////////////////////////
function querySpotify() {
    if (!queryArg) {
        queryArg = "The Sign Ace of Base";
    }
    spotify
        .search({
            type: "track",
            query: queryArg,
            limit: 1
        })
        .then(function (response) {
            track = response.tracks.items[0];
            console.log("Artist:  " + track.album.artists[0].name);
            console.log("Track:   " + track.name);
            fs.appendFileSync(logFile, "Artist:  " + track.album.artists[0].name + "\n");
            fs.appendFileSync(logFile, "Track:   " + track.name + "\n");
            if (track.preview_url) {
                console.log("Preview: " + track.preview_url);
                fs.appendFileSync(logFile, ("Preview: " + track.preview_url + "\n"));
            }
            console.log("Album:   " + track.album.name);
            fs.appendFileSync(logFile, ("Album:   " + track.album.name + "\n"));
        })
        .catch(function (err) {
            console.log(err);
            fs.appendFileSync(logFile, err + "\n");
        });

}

////////////////////////////////////////////
// Query the OMDB API for movie info
////////////////////////////////////////////
function queryOmdb() {
    if (!queryArg) {
        queryArg = "Mr+Nobody";
    }
    var queryURL = "http://www.omdbapi.com/?t=" + queryArg + "&y=&apikey=trilogy";
    axios.get(queryURL).then(
            function (response) {
                if (response) {
                    console.log("Title:           " + response.data.Title);
                    console.log("Year:            " + response.data.Year);
                    console.log("IMDb:            " + response.data.imdbRating);
                    console.log("Rotten Tomatoes: " + response.data.Ratings[1]);
                    console.log("Country:         " + response.data.Country);
                    console.log("Language:        " + response.data.Language);
                    console.log("Plot:            " + response.data.Plot);
                    console.log("Actors:          " + response.data.Actors);
                    fs.appendFileSync(logFile, "Title:           " + response.data.Title + "\n");
                    fs.appendFileSync(logFile, "Year:            " + response.data.Year + "\n");
                    fs.appendFileSync(logFile, "IMDb:            " + response.data.imdbRating + "\n");
                    fs.appendFileSync(logFile, "Rotten Tomatoes: " + response.data.Ratings[1] + "\n");
                    fs.appendFileSync(logFile, "Country:         " + response.data.Country + "\n");
                    fs.appendFileSync(logFile, "Language:        " + response.data.Language + "\n");
                    fs.appendFileSync(logFile, "Plot:            " + response.data.Plot + "\n");
                    fs.appendFileSync(logFile, "Actors:          " + response.data.Actors + "\n");
                }
            })
        .catch(function (error) {
            console.log(error);
            fs.appendFileSync(logFile, error + "\n");
        });
}

////////////////////////////////////////////
// Process commands in Random.txt
////////////////////////////////////////////
function processRandomTxt() {
    fs.readFile(fileName, "utf-8", function (err, data) {
        if (err) throw err;
        data = data.split(",");
        command = data[0];
        queryArg = data[1];
        processInput(command);
    });
}

function addToLog() {
    fs.appendFileSync(logFile, command + "," + queryArg + "\n");
}

fs.appendFileSync(logFile, "\n-----------------------------------------\n\n");
////////////////////////////////////////////
// Process Input on Stsrt Up
////////////////////////////////////////////
processInput();