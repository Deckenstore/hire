import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAAum8UicFCCF5bgwMQUzqmK3lR2b0oFGk",
  authDomain: "dg-service-5a315.firebaseapp.com",
  projectId: "dg-service-5a315",
  storageBucket: "dg-service-5a315.firebasestorage.app",
  messagingSenderId: "482066361849",
  appId: "1:482066361849:web:bfe4a061475324aa01e128",
  measurementId: "G-WY1CEXEREF"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const email = document.getElementById("email");
const password = document.getElementById("password");

// Login
loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((err) => alert(err.message));
});

// Signup
signupBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((err) => alert(err.message));
});

// Auto redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});