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

const workerInfo = document.getElementById("workerInfo");
const payBtn = document.getElementById("payBtn");
const logoutBtn = document.getElementById("logout-btn");

// Commission %
const COMMISSION_PERCENT = 14.5;

// Get Worker ID from URL
const urlParams = new URLSearchParams(window.location.search);
const workerId = urlParams.get("id");

let workerPrice = 0;

async function loadWorker() {
  if (!workerId) {
    workerInfo.innerHTML = "<p>No worker selected.</p>";
    payBtn.style.display = "none";
    return;
  }

  const snapshot = await get(ref(db, "workers/" + workerId));
  if (!snapshot.exists()) {
    workerInfo.innerHTML = "<p>Worker not found.</p>";
    payBtn.style.display = "none";
    return;
  }

  const data = snapshot.val();

  // Convert price range to number (take min value for payment)
  workerPrice = parseInt(data.priceRange.split("-")[0]);

  const commission = (workerPrice * COMMISSION_PERCENT) / 100;
  const totalAmount = workerPrice + commission;

  workerInfo.innerHTML = `
    <h3>${data.name}</h3>
    <p><strong>Category:</strong> ${data.category}</p>
    <p><strong>Price Range:</strong> ${data.priceRange}</p>
    <p><strong>Platform Commission (14.5%):</strong> ₹${commission.toFixed(2)}</p>
    <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
  `;

  return totalAmount;
}

// Razorpay Payment
payBtn.addEventListener("click", async () => {
  const total = await loadWorker();

  var options = {
    key: "YOUR_RAZORPAY_KEY", // Enter your Razorpay Key
    amount: total * 100, // in paise
    currency: "INR",
    name: "GapHire",
    description: "Payment for hiring " + workerId,
    handler: function (response) {
      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      // TODO: Save transaction in Firebase if needed
    },
    prefill: {
      email: auth.currentUser ? auth.currentUser.email : "",
    },
    theme: {
      color: "#5d56f9"
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
});

// Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login to hire workers.");
    window.location.href = "index.html";
  } else {
    logoutBtn.style.display = "inline-block";
    loadWorker();
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});