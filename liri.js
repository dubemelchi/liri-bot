// here we are telling the app to require the dotenv node package and setting it to config()
require('dotenv').config();

// here the app must import the node-spotify-api and set it to the Spotify Variable
var Spotify = require('node-spotify-api');

// importing the whatever is setup in the keys js file and setting to the keys variable
var keys = require('./keys');

// importing the axios node package and setting it to axios variable
var axios = require('axios');

// importing the moment package and setting it to moment variable
var moment = require('moment');

// importing the FS package for reading and writing
var fs = require('fs');

// here the app will initialize the spofity client using our id and secret
var spotify = new Spotify(keys.spotify);

// we want to get the artist name
// we create a variable to store the name when we get it
// we create a function with a param of artist.
// that function will return an object and from that object we want the name.
var getArtistNames = function(artist) {
  return artist.name;
};

// we want to run a search
// we create a search variable ie getMeSpotiy
// we want to search spotify by song name
// we set that variable to a function
// in that function we will add the param of songName which we have not defined yet
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }

  // we set spotify to a search and create and object that will return a track by querying by songName entered in getMeSpotify above
  spotify.search(
    {
      type: 'track',
      query: songName
    },
    // we create a function handle any errors that occurr during the query
    function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }

      //
      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
        console.log('song name: ' + songs[i].name);
        console.log('preview song: ' + songs[i].preview_url);
        console.log('album: ' + songs[i].album.name);
        console.log('-----------------------------------');
      }
    }
  );
};

var getMyBands = function(artist) {
  var queryURL =
    'https://rest.bandsintown.com/artists/' +
    artist +
    '/events?app_id=codingbootcamp';

  axios.get(queryURL).then(function(response) {
    var jsonData = response.data;

    if (!jsonData.length) {
      console.log('No results found for ' + artist);
      return;
    }

    console.log('Upcoming concerts for ' + artist + ':');

    for (var i = 0; i < jsonData.length; i++) {
      var show = jsonData[i];

      console.log(
        show.venue.city +
          ',' +
          (show.venue.region || show.venue.country) +
          ' at ' +
          show.venue.name +
          ' ' +
          moment(show.datetime).format('MM/DD/YYYY')
      );
    }
  });
};

var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var urlHit =
    'http://www.omdbapi.com/?t=' +
    movieName +
    '&y=&plot=full&tomatoes=true&apikey=trilogy';

  axios.get(urlHit).then(function(response) {
    var jsonData = response.data;

    console.log('Title: ' + jsonData.Title);
    console.log('Year: ' + jsonData.Year);
    console.log('Rated: ' + jsonData.Rated);
    console.log('IMDB Rating: ' + jsonData.imdbRating);
    console.log('Country: ' + jsonData.Country);
    console.log('Language: ' + jsonData.Language);
    console.log('Plot: ' + jsonData.Plot);
    console.log('Actors: ' + jsonData.Actors);
    console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
  });
};

var doWhatItSays = function() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    console.log(data);

    var dataArr = data.split(',');

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'concert-this':
      getMyBands(functionData);
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(' '));
