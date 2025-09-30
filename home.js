// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// TODO: Replace with your Firebase project configconst firebaseConfig = {
  apiKey: "AIzaSyCu3VRaBW9_SBtu1PHH59S1dv0_3jdCCt8",
  authDomain: "chat-a72c9.firebaseapp.com",
  databaseURL: "https://chat-a72c9-default-rtdb.firebaseio.com",
  projectId: "chat-a72c9",
  storageBucket: "chat-a72c9.firebasestorage.app",
  messagingSenderId: "1096757771676",
  appId: "1:1096757771676:web:193148a268626df94a5c59",
  measurementId: "G-6ETV9BXKH4"
};


// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Elements
const workersGrid = document.getElementById("workersGrid");
const searchBar = document.getElementById("searchBar");
const logoutBtn = document.getElementById("logout-btn");

// Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("signup-btn").style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("signup-btn").style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Load Workers
function loadWorkers(filter = "") {
  const workersRef = ref(db, "workers");
  onValue(workersRef, (snapshot) => {
    workersGrid.innerHTML = "";
    snapshot.forEach(childSnap => {
      const worker = childSnap.val();
      if (filter && !worker.category.toLowerCase().includes(filter.toLowerCase())) return;

      const card = document.createElement("div");
      card.className = "service-item";
      card.innerHTML = `
        <h3>${worker.name}</h3>
        <p><strong>${worker.category}</strong></p>
        <ul>
          ${worker.skills.map(skill => `<li>${skill}</li>`).join("")}
        </ul>
        <p>Phone: ${worker.phoneMasked}</p>
        <button onclick="viewAbout('${childSnap.key}')" class="btn">View About</button>
        <button onclick="hireNow('${childSnap.key}')" class="btn">Hire Now</button>
      `;
      workersGrid.appendChild(card);
    });
  });
}

// Search
searchBar.addEventListener("input", (e) => {
  loadWorkers(e.target.value);
});

// Redirect Functions
window.viewAbout = (id) => {
  window.location.href = `view.html?id=${id}`;
};

window.hireNow = (id) => {
  window.location.href = `hire.html?id=${id}`;
};

// Initial Load
loadWorkers();