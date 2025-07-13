import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfrhiskCagKW3X-IybZYZh0_K4F1j7724",
  authDomain: "schedule-for-student.firebaseapp.com",
  projectId: "schedule-for-student",
  storageBucket: "schedule-for-student.firebasestorage.app",
  messagingSenderId: "454469640747",
  appId: "1:454469640747:web:991147e163e36e9d2bc06e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseFunctions = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  signOut,
  doc,
  setDoc,
  getDoc,
};

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    console.log("User logged in:", user);
    await loadDashboard(user);
  } else {
    showAuthPage();
  }
});

async function loadDashboard(user) {
  try {
    const studentDoc = await getDoc(doc(db, "students", user.uid));

    if (studentDoc.exists()) {
      const studentData = studentDoc.data();
      updateDashboard(studentData);
      showDashboardPage();
    } else {
      console.error("No student data found");
      showAuthPage();
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    showAuthPage();
  }
}

function updateDashboard(studentData) {
  document.getElementById("userName").textContent = studentData.studentId;
  document.getElementById(
    "userClass"
  ).textContent = `${studentData.gradeLevel}/${studentData.classroom}`;
  document.getElementById(
    "welcomeTitle"
  ).textContent = `ยินดีต้อนรับกลับมา ${studentData.studentId}!`;
  document.getElementById("studentIdValue").textContent = studentData.studentId;
  document.getElementById("gradeLevelValue").textContent =
    studentData.gradeLevel;
  document.getElementById(
    "classroomValue"
  ).textContent = `ห้อง ${studentData.classroom}`;
  document.getElementById("emailValue").textContent = studentData.email;

  loadScheduleForClass(studentData.gradeLevel, studentData.classroom);
  updateCurrentClass();

  setInterval(updateCurrentClass, 60000);
}

function showAuthPage() {
  document.getElementById("authPage").classList.add("active");
  document.getElementById("dashboardPage").classList.remove("active");
}

function showDashboardPage() {
  document.getElementById("authPage").classList.remove("active");
  document.getElementById("dashboardPage").classList.add("active");
}

window.showAuthPage = showAuthPage;
window.showDashboardPage = showDashboardPage;

console.log("Firebase initialized successfully");
