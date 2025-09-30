// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const workersList = document.getElementById("workersList");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logout-btn");

// Load Workers
function loadWorkers(search = "") {
  onValue(ref(db, "workers"), (snapshot) => {
    workersList.innerHTML = "";

    if (!snapshot.exists()) {
      workersList.innerHTML = "<p>No workers available.</p>";
      return;
    }

    let workers = snapshot.val();
    let found = false;

    Object.keys(workers).forEach((id) => {
      let w = workers[id];

      // Search by category only
      if (search && !w.category.toLowerCase().includes(search.toLowerCase())) {
        return;
      }

      found = true;

      let card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3>${w.name}</h3>
        <p><strong>Category:</strong> ${w.category}</p>
        <p><strong>Skills:</strong> ${w.skills.join(", ")}</p>
        <p><strong>Price Range:</strong> ${w.priceRange}</p>
        <p><strong>Contact:</strong> ${w.phoneMasked}</p>
        <div class="card-actions">
          <a href="view.html?id=${id}" class="btn">View About</a>
          <a href="hire.html?id=${id}" class="btn">Hire Now</a>
        </div>
      `;

      workersList.appendChild(card);
    });

    if (!found) {
      workersList.innerHTML = "<p>No workers found for this category.</p>";
    }
  });
}

// Search Event
searchInput.addEventListener("input", (e) => {
  loadWorkers(e.target.value.trim());
});

// Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login to access the dashboard.");
    window.location.href = "index.html";
  } else {
    logoutBtn.style.display = "inline-block";
    loadWorkers();
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});