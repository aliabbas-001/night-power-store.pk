// Firebase Configuration for Night Power - LIVE PROJECT
const firebaseConfig = {
    apiKey: "AIzaSyCusKZfsCqZBSy2P90asbt1SBU0tpt9aIY",
    authDomain: "nightpower-19144.firebaseapp.com",
    projectId: "nightpower-19144",
    storageBucket: "nightpower-19144.firebasestorage.app",
    messagingSenderId: "1089009132918",
    appId: "1:1089009132918:web:e6c37508678989e20cc657",
    measurementId: "G-NLM7VGW1MG"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;
