const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://hotcitiesworld.firebaseio.com"
});

const db = admin.firestore();

module.exports = {
  db
};
