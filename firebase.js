const admin = require("firebase-admin");
const firebaseKeys = require("./firebase-keys.json");

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
  databaseURL: "https://hotcitiesworld.firebaseio.com"
});

const db = admin.firestore();

module.exports = {
  admin,
  db
};
