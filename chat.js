// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logout-btn");

// Example: use query params to define worker id
const urlParams = new URLSearchParams(window.location.search);
const workerId = urlParams.get("workerId");
let currentUserId = "";

// Function to sanitize message (block 6+ digit numbers)
function sanitizeMessage(msg) {
  return msg.replace(/\b\d{6,}\b/g, "[REDACTED]");
}

// Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login to access chat.");
    window.location.href = "index.html";
    return;
  }
  currentUserId = user.uid;
  logoutBtn.style.display = "inline-block";
  initChat();
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Initialize Chat
function initChat() {
  const chatRef = ref(db, "chats/" + workerId + "/" + currentUserId);

  // Load messages in real-time
  onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    const p = document.createElement("p");
    p.innerHTML = `<strong>${data.sender}:</strong> ${data.message}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // Send message
  sendBtn.addEventListener("click", () => {
    let msg = chatInput.value.trim();
    if (!msg) return;

    msg = sanitizeMessage(msg);

    push(chatRef, {
      sender: currentUserId,
      message: msg,
      timestamp: Date.now()
    });

    chatInput.value = "";
  });
}