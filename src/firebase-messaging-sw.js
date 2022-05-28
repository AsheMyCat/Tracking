importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9..8.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBL5iuzpxJKsbt41ryRV4IqNY5pTSEmH8Q",
    authDomain: "mydemo1235.firebaseapp.com",
    databaseURL: "https://mydemo1235-default-rtdb.firebaseio.com",
    projectId: "mydemo1235",
    storageBucket: "mydemo1235.appspot.com",
    messagingSenderId: "883888973176",
    appId: "1:883888973176:web:62c6e2d75b1d3fe870548d",
    measurementId: "G-FB6BGPKYS9"
});
const messaging = firebase.messaging();