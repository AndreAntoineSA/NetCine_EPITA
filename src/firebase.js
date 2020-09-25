import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCoieSJmfLedQZ4gKDpylFQumbwWHQEpdo",
  authDomain: "netcine-epita.firebaseapp.com",
  databaseURL: "https://netcine-epita.firebaseio.com",
  projectId: "netcine-epita",
  storageBucket: "netcine-epita.appspot.com",
  messagingSenderId: "476672768857",
  appId: "1:476672768857:web:e3c25de870f0146b6faa48",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
