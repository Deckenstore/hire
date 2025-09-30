import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAum8UicFCCF5bgwMQUzqmK3lR2b0oFGk",
  authDomain: "dg-service-5a315.firebaseapp.com",
  databaseURL: "https://dg-service-5a315-default-rtdb.firebaseio.com", // ✅ Add this
  projectId: "dg-service-5a315",
  storageBucket: "dg-service-5a315.appspot.com",
  messagingSenderId: "482066361849",
  appId: "1:482066361849:web:bfe4a061475324aa01e128",
  measurementId: "G-WY1CEXEREF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ DOM Elements
const workerForm = document.getElementById("workerForm");
const addSkillBtn = document.getElementById("addSkillBtn");
const skillsContainer = document.getElementById("skillsContainer");
const logoutBtn = document.getElementById("logout-btn");

// --- Utility: Mask Phone ---
function maskPhoneNumber(phone) {
    if (phone.length >= 10) {
        return phone.substring(0, 3) + "XXXXXXX";
    }
    return phone.substring(0, 2) + "XXXXXXXX";
}

// --- Add Skill ---
addSkillBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "form-group skill-group";
  div.innerHTML = `
    <label>Skills</label>
    <select class="skill-dropdown">
      <option value="Web Development">Web Development</option>
      <option value="App Development">App Development</option>
      <option value="Business Suggestions">Business Suggestions</option>
      <option value="Digital Works">Digital Works</option>
      <option value="Social Media Management">Social Media Management</option>
    </select>
  `;
  skillsContainer.appendChild(div);
});

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login to register as a worker.");
    window.location.href = "index.html";
  } else {
    logoutBtn.style.display = "inline-block";
    const emailField = document.getElementById("email");
    if (emailField && user.email) {
        emailField.value = user.email;
    }
  }
});

// --- Logout ---
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// --- Submit Form ---
workerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) {
      alert("Error: Please login again.");
      return;
  }

  try {
    const name = document.getElementById("name").value.trim();
    const email = user.email; 
    const phone = document.getElementById("phone").value.trim();
    const category = document.getElementById("category").value;
    const priceRange = document.getElementById("priceRange").value;

    if (!name || !phone || !category || !priceRange) {
        alert("Please fill all required fields.");
        return;
    }

    const skills = [];
    document.querySelectorAll(".skill-dropdown").forEach(sel => {
      if (sel.value && sel.value !== "") skills.push(sel.value);
    });
    
    if (skills.length === 0) {
        alert("Please select at least one skill.");
        return;
    }

    const phoneMasked = maskPhoneNumber(phone);

    const workersRef = ref(db, "workers");
    const newWorkerRef = push(workersRef);
    
    await set(newWorkerRef, {
      name,
      email,
      phoneMasked,
      category,
      skills,
      priceRange,
      workerUid: user.uid,
      isVerified: false,
      createdAt: new Date().toISOString()
    });

    alert("Worker Registered Successfully! 🎉");
    workerForm.reset();
  } catch (err) {
    console.error("Error registering worker:", err);
    alert(`Error: ${err.message}`);
  }
});