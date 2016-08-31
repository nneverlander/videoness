const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/storage");

const config = {
  apiKey: "AIzaSyAfWqymZlexJoXGv34k-JBmMaiR6VmZY9o",
  authDomain: "videoness-68f59.firebaseapp.com",
  databaseURL: "https://videoness-68f59.firebaseio.com",
  storageBucket: "videoness-68f59.appspot.com"
};

const fbApp = firebase.initializeApp(config);

module.exports = fbApp;
