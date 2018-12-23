const functions = require('firebase-functions');
const path = require('path');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log('joe, lekker loggen!');
  response.send("Hello from dinges!");
});
