// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAum8UicFCCF5bgwMQUzqmK3lR2b0oFGk",
  authDomain: "dg-service-5a315.firebaseapp.com",
  projectId: "dg-service-5a315",
  storageBucket: "dg-service-5a315.firebasestorage.app",
  messagingSenderId: "482066361849",
  appId: "1:482066361849:web:bfe4a061475324aa01e128",
  measurementId: "G-WY1CEXEREF"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const workerDetailsDiv = document.getElementById("workerDetails");
const hireBtn = document.getElementById("hireBtn");
const logoutBtn = document.getElementById("logout-btn");

// Get Worker ID from URL
const urlParams = new URLSearchParams(window.location.search);
const workerId = urlParams.get("id");

async function loadWorker() {
  if (!workerId) {
    workerDetailsDiv.innerHTML = "<p>No worker selected.</p>";
    hireBtn.style.display = "none";
    return;
  }

  const snapshot = await get(ref(db, "workers/" + workerId));
  if (!snapshot.exists()) {
    workerDetailsDiv.innerHTML = "<p>Worker not found.</p>";
    hireBtn.style.display = "none";
    return;
  }

  const data = snapshot.val();
  workerDetailsDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p><strong>Category:</strong> ${data.category}</p>
    <p><strong>Skills:</strong> ${data.skills.join(", ")}</p>
    <p><strong>Price Range:</strong> ${data.priceRange}</p>
    <p><strong>Contact:</strong> ${data.phoneMasked}</p>
  `;
}

// Hire Button
hireBtn.addEventListener("click", () => {
  if (workerId) {
    // Redirect to hire.html with the worker ID in the URL
    window.location.href = `hire.html?id=${workerId}`;
  }
});


// Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login to view worker profiles.");
    window.location.href = "index.html";
  } else {
    logoutBtn.style.display = "inline-block";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Load Worker
loadWorker();