// message notifying user that api keys have 'loaded'
console.log('Keys loaded');

// exporting the spotify secret to be used in api query.
// we set this export to the 'keys' variable in liri.js
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
