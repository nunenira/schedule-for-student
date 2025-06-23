let currentUser = null;
let currentSchedule = null;

const scheduleData = {
  "ม.6": {
    5: {
      Monday: [
        "ฟิสิกส์<br><small>ห้อง 911</small>",
        "ฟิสิกส์<br><small>ห้อง 911</small>",
        "ศึกษาสร้างองค์ความรู้<br><small>ห้อง 801</small>",
        "ศึกษาสร้างองค์ความรู้<br><small>ห้อง 801</small>",
        "",
        "คณิตเพิ่ม<br><small>ห้อง 1126</small>",
        "อังกฤษเพื่อการศึกษาต่อ<br><small>ห้อง 1126</small>",
        "พละ<br><small>ลาน 12</small>",
        "อังกฤษฟังพูด<br><small>ห้อง 1126</small>",
        "",
      ],
      Tuesday: [
        "คณิตเพิ่ม<br><small>ห้อง 1126</small>",
        "ประวัติศาสตร์<br><small>ห้อง 1126</small>",
        "ฟิสิกส์<br><small>ห้อง 911</small>",
        "ฟิสิกส์<br><small>ห้อง 911</small>",
        "",
        "อังกฤษเสริมทักษะ<br><small>ห้อง 1126</small>",
        "อังกฤษเพื่อการศึกษาต่อ<br><small>ห้อง 1126</small>",
        "อังกฤษเพื่อการสื่อสาร<br><small>ห้อง 1126</small>",
        "",
      ],
      Wednesday: [
        "อังกฤษเสริมทักษะ<br><small>ห้อง 1126</small>",
        "ประวัติศาสตร์<br><small>ห้อง 1126</small>",
        "โครงงาน<br><small>ห้อง 515,1231</small>",
        "โครงงาน<br><small>ห้อง 515,1231</small>",
        "",
        "ไทย<br><small>ห้อง 1126</small>",
        "เคมี<br><small>ห้อง 331</small>",
        "ศิลปะ<br><small>ห้อง 702</small>",
        "",
        "",
      ],
      Thursday: [
        "เทคโนโลยีสารสนเทศ<br><small>ห้อง 513</small>",
        "เทคโนโลยีสารสนเทศ<br><small>ห้อง 513</small>",
        "แนะแนว<br><small>ห้อง 1222</small>",
        "",
        "ชีววิทยา<br><small>ห้อง 321</small>",
        "ชีววิทยา<br><small>ห้อง 321</small>",
        "คณิตเพิ่ม<br><small>ห้อง 1126</small>",
        "กิจกรรม",
        "กิจกรรมรักษาดินแดน",
      ],
      Friday: [
        "ไทย<br><small>ห้อง 1126</small>",
        "อังกฤษฟังพูด<br><small>ห้อง 1126</small>",
        "คณิตเพิ่ม<br><small>ห้อง 1126</small>",
        "ชีววิทยา<br><small>321</small>",
        "",
        "อังกฤษเสริมทักษะ<br><small>ห้อง 1126</small>",
        "เคมี<br><small>ห้อง 331</small>",
        "เคมี<br><small>ห้อง 331</small>",
        "",
        "",
      ],
    },
  },
};

const timeSlots = [
  { time: "08:30 - 09:20", period: 1 },
  { time: "09:20 - 10:10", period: 2 },
  { time: "10:15 - 11:05", period: 3 },
  { time: "11:05 - 11:55", period: 4 },
  { time: "11:55 - 12:45", period: 5 },
  { time: "12:45 - 13:35", period: 6 },
  { time: "13:35 - 14:25", period: 7 },
  { time: "14:30 - 15:20", period: 8 },
  { time: "15:20 - 16:10", period: 9 },
  { time: "16:10 - 17:00", period: 10 },
];

function showLoading(show = true) {
  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = show ? "flex" : "none";
}

function showAlert(message, type) {
  const alertDiv = document.getElementById(
    type === "success" ? "successAlert" : "errorAlert"
  );
  const otherAlert = document.getElementById(
    type === "success" ? "errorAlert" : "successAlert"
  );

  otherAlert.style.display = "none";
  alertDiv.textContent = message;
  alertDiv.style.display = "block";

  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 5000);
}

function clearErrors() {
  const inputs = document.querySelectorAll("input, select");
  const errors = document.querySelectorAll(".error-message");

  inputs.forEach((input) => {
    input.classList.remove("error", "success");
  });

  errors.forEach((error) => {
    error.style.display = "none";
    error.textContent = "";
  });
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "Error");

  field.classList.add("error");
  field.classList.remove("success");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function showSuccess(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "Error");

  field.classList.add("success");
  field.classList.remove("error");
  errorDiv.style.display = "none";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateStudentId(studentId) {
  const re = /^4[0-9]{4}$/;
  return re.test(studentId);
}

function updateClassroomOptions(gradeLevel) {
  const classroomSelect = document.getElementById("classroom");

  classroomSelect.innerHTML =
    '<option value="" disabled selected hidden></option>';

  if (!gradeLevel) {
    classroomSelect.disabled = true;
    return;
  }

  classroomSelect.disabled = false;

  let maxRooms;
  if (["ม.1", "ม.2", "ม.3"].includes(gradeLevel)) {
    maxRooms = 10;
  } else if (["ม.4", "ม.5", "ม.6"].includes(gradeLevel)) {
    maxRooms = 16;
  }

  for (let i = 1; i <= maxRooms; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.textContent = i.toString();
    classroomSelect.appendChild(option);
  }
}

function showLogin() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleSlider = document.getElementById("toggleSlider");
  const toggleBtns = document.querySelectorAll(".toggle-btn");

  toggleBtns[0].classList.add("active");
  toggleBtns[1].classList.remove("active");
  toggleSlider.classList.remove("register");

  registerForm.classList.remove("active");
  loginForm.classList.add("active");
  clearErrors();
}

function showRegister() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleSlider = document.getElementById("toggleSlider");
  const toggleBtns = document.querySelectorAll(".toggle-btn");

  toggleBtns[1].classList.add("active");
  toggleBtns[0].classList.remove("active");
  toggleSlider.classList.add("register");

  loginForm.classList.remove("active");
  registerForm.classList.add("active");
  clearErrors();
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector(".show-password");
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
}

async function loginUser(email, password) {
  try {
    showLoading(true);

    const userCredential =
      await window.firebaseFunctions.signInWithEmailAndPassword(
        window.firebaseAuth,
        email,
        password
      );

    if (!userCredential.user.emailVerified) {
      showAlert(
        "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ กรุณาตรวจสอบอีเมลของคุณ",
        "error"
      );
      return;
    }

    console.log("User logged in successfully");
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "เข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "ไม่พบบัญชีที่ใช้อีเมลนี้";
        break;
      case "auth/wrong-password":
        errorMessage = "รหัสผ่านไม่ถูกต้อง";
        break;
      case "auth/invalid-email":
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      case "auth/invalid-credential":
        errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณาลองใหม่อีกครั้งในภายหลัง";
        break;
    }

    showAlert(errorMessage, "error");
  } finally {
    showLoading(false);
  }
}

async function registerUser(studentId, gradeLevel, classroom, email, password) {
  try {
    showLoading(true);

    const userCredential =
      await window.firebaseFunctions.createUserWithEmailAndPassword(
        window.firebaseAuth,
        email,
        password
      );

    await window.firebaseFunctions.updateProfile(userCredential.user, {
      displayName: `${studentId} - ${gradeLevel}/${classroom}`,
    });

    await window.firebaseFunctions.sendEmailVerification(userCredential.user);

    const studentData = {
      studentId: studentId.trim(),
      gradeLevel: gradeLevel,
      classroom: classroom,
      email: email,
      uid: userCredential.user.uid,
      createdAt: new Date(),
      role: "student",
      emailVerified: false,
    };

    await window.firebaseFunctions.setDoc(
      window.firebaseFunctions.doc(
        window.firebaseDb,
        "students",
        userCredential.user.uid
      ),
      studentData
    );

    showAlert(
      "บัญชีถูกสร้างเรียบร้อยแล้ว! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
      "success"
    );

    setTimeout(() => {
      showLogin();
    }, 3000);
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "มีบัญชีที่ใช้อีเมลนี้อยู่แล้ว";
        break;
      case "auth/invalid-email":
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      case "auth/weak-password":
        errorMessage =
          "รหัสผ่านไม่ปลอดภัยพอ กรุณาเลือกรหัสผ่านที่แข็งแกร่งกว่า";
        break;
    }

    showAlert(errorMessage, "error");
  } finally {
    showLoading(false);
  }
}

async function forgotPassword() {
  const email = prompt("กรุณากรอกอีเมลของคุณ:");
  if (!email) return;

  if (!validateEmail(email)) {
    showAlert("กรุณากรอกอีเมลให้ถูกต้อง", "error");
    return;
  }

  try {
    showLoading(true);
    await window.firebaseFunctions.sendPasswordResetEmail(
      window.firebaseAuth,
      email
    );
    showAlert("ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว", "success");
  } catch (error) {
    console.error("Password reset error:", error);
    let errorMessage = "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้";

    if (error.code === "auth/user-not-found") {
      errorMessage = "ไม่พบบัญชีที่ใช้อีเมลนี้";
    }

    showAlert(errorMessage, "error");
  } finally {
    showLoading(false);
  }
}

async function logout() {
  try {
    showLoading(true);
    await window.firebaseFunctions.signOut(window.firebaseAuth);
    showAuthPage();
    showAlert("ออกจากระบบเรียบร้อยแล้ว", "success");
  } catch (error) {
    console.error("Logout error:", error);
    showAlert("เกิดข้อผิดพลาดในการออกจากระบบ", "error");
  } finally {
    showLoading(false);
  }
}

function loadScheduleForClass(gradeLevel, classroom) {
  if (scheduleData[gradeLevel] && scheduleData[gradeLevel][classroom]) {
    currentSchedule = scheduleData[gradeLevel][classroom];
    displayScheduleTable();
    displayTodaySchedule();
  } else {
    document.getElementById("scheduleContent").innerHTML = `
            <p style="color: #666; text-align: center; padding: 20px;">
                <i class="bi bi-calendar-x" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                ตารางเรียนสำหรับ ${gradeLevel}/${classroom} ยังไม่พร้อมใช้งาน
            </p>
        `;
  }
}

function displayScheduleTable() {
  const scheduleHTML = `
        <table class="schedule-table">
            <thead>
                <tr>
                    <th>คาบ</th>
                    <th>เวลา</th>
                    <th>จันทร์</th>
                    <th>อังคาร</th>
                    <th>พุธ</th>
                    <th>พฤหัสบดี</th>
                    <th>ศุกร์</th>
                </tr>
            </thead>
            <tbody>
                ${timeSlots
                  .map((slot) => {
                    if (slot.period === "break") {
                      return `
                            <tr class="break-time">
                                <td>-</td>
                                <td>${slot.time}</td>
                                <td colspan="5">${slot.subject}</td>
                            </tr>
                        `;
                    } else {
                      const dayNames = [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ];
                      return `
                            <tr data-period="${slot.period}">
                                <td>${slot.period}</td>
                                <td>${slot.time}</td>
                                ${dayNames
                                  .map((day) => {
                                    const subject =
                                      currentSchedule[day][slot.period - 1] ||
                                      "-";
                                    return `<td>${subject}</td>`;
                                  })
                                  .join("")}
                            </tr>
                        `;
                    }
                  })
                  .join("")}
            </tbody>
        </table>
    `;

  document.getElementById("scheduleContent").innerHTML = scheduleHTML;
}

function stripHTML(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function getSubjectName(fullSubject) {
  return fullSubject.split("<br>")[0];
}

function displayTodaySchedule() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();
  const todayName = days[today];

  const todayScheduleContainer = document.getElementById(
    "todayScheduleContent"
  );

  if (today === 0 || today === 6) {
    todayScheduleContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <i class="bi bi-calendar-x" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                <p>วันหยุด - ไม่มีเรียน</p>
            </div>
        `;
    return;
  }

  if (!currentSchedule[todayName]) {
    todayScheduleContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <i class="bi bi-calendar-x" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                <p>ไม่มีตารางเรียนสำหรับวันนี้</p>
            </div>
        `;
    return;
  }

  const todaySubjects = currentSchedule[todayName];
  const scheduleHTML = timeSlots
    .filter((slot) => slot.period !== "break")
    .map((slot, index) => {
      const subject = todaySubjects[slot.period - 1];
      if (!subject || subject.trim() === "") {
        return `
                    <div class="today-class-item empty" data-period="${slot.period}">
                        <div class="class-time">${slot.time}</div>
                        <div class="class-subject">ว่าง</div>
                    </div>
                `;
      }
      return `
                <div class="today-class-item" data-period="${slot.period}">
                    <div class="class-time">${slot.time}</div>
                    <div class="class-subject">${getSubjectName(subject)}</div>
                </div>
            `;
    })
    .join("");

  todayScheduleContainer.innerHTML = scheduleHTML;
}

function updateCurrentClass() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[now.getDay()];

  if (
    today === "Sunday" ||
    today === "Saturday" ||
    !currentSchedule ||
    !currentSchedule[today]
  ) {
    document.getElementById("currentClassInfo").innerHTML = `
            <div class="current-class-card">
                <div class="class-status">วันหยุด</div>
                <div class="class-name">ไม่มีเรียน</div>
            </div>
        `;
    return;
  }

  let currentClass = null;
  let nextClass = null;
  let currentPeriod = null;

  for (let i = 0; i < timeSlots.length; i++) {
    const slot = timeSlots[i];
    if (slot.period === "break") continue;

    const [startHour, startMin] = slot.time
      .split(" - ")[0]
      .split(":")
      .map(Number);
    const [endHour, endMin] = slot.time.split(" - ")[1].split(":").map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (currentTime >= startTime && currentTime <= endTime) {
      const subject = currentSchedule[today][slot.period - 1];
      if (subject && subject.trim() !== "") {
        currentClass = getSubjectName(subject);
        currentPeriod = slot.period;
      }

      // Find next class
      for (let j = i + 1; j < timeSlots.length; j++) {
        if (timeSlots[j].period !== "break") {
          const nextSubject = currentSchedule[today][timeSlots[j].period - 1];
          if (nextSubject && nextSubject.trim() !== "") {
            nextClass = getSubjectName(nextSubject);
            break;
          }
        }
      }
      break;
    } else if (currentTime < startTime) {
      const subject = currentSchedule[today][slot.period - 1];
      if (subject && subject.trim() !== "") {
        nextClass = getSubjectName(subject);
        break;
      }
    }
  }

  if (currentClass) {
    document.getElementById("currentClassInfo").innerHTML = `
            <div class="current-class-card active">
                <div class="class-status">กำลังเรียน</div>
                <div class="class-name">${currentClass}</div>
                <div class="class-period">คาบที่ ${currentPeriod}</div>
            </div>
            ${
              nextClass
                ? `
                <div class="next-class-card">
                    <div class="class-status">คาบต่อไป</div>
                    <div class="class-name">${nextClass}</div>
                </div>
            `
                : ""
            }
        `;

    highlightCurrentPeriod(currentPeriod);
  } else if (nextClass) {
    document.getElementById("currentClassInfo").innerHTML = `
            <div class="current-class-card">
                <div class="class-status">คาบต่อไป</div>
                <div class="class-name">${nextClass}</div>
            </div>
        `;
  } else {
    document.getElementById("currentClassInfo").innerHTML = `
            <div class="current-class-card">
                <div class="class-status">หมดเวลาเรียนแล้ว</div>
                <div class="class-name">ไม่มีคาบเรียน</div>
            </div>
        `;
  }
}

function highlightCurrentPeriod(period) {
  document.querySelectorAll(".schedule-table tbody tr").forEach((row) => {
    row.classList.remove("current-period");
  });

  document.querySelectorAll(".today-class-item").forEach((item) => {
    item.classList.remove("current-period");
  });

  const currentRow = document.querySelector(`[data-period="${period}"]`);
  if (currentRow) {
    currentRow.classList.add("current-period");
  }
}

function showFeature(featureName) {
  alert(
    `${featureName} feature would be implemented here.\n\nThis is a demo dashboard showing how the system works.`
  );
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginFormElement")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      let isValid = true;

      if (!email) {
        showError("loginEmail", "กรุณากรอกอีเมล");
        isValid = false;
      } else if (!validateEmail(email)) {
        showError("loginEmail", "กรุณากรอกอีเมลให้ถูกต้อง");
        isValid = false;
      } else {
        showSuccess("loginEmail");
      }

      if (!password) {
        showError("loginPassword", "กรุณากรอกรหัสผ่าน");
        isValid = false;
      } else {
        showSuccess("loginPassword");
      }

      if (isValid) {
        const loginBtn = document.getElementById("loginBtn");
        const originalText = loginBtn.textContent;
        loginBtn.textContent = "กำลังเข้าสู่ระบบ...";
        loginBtn.disabled = true;

        loginUser(email, password).finally(() => {
          loginBtn.textContent = originalText;
          loginBtn.disabled = false;
        });
      }
    });

  document
    .getElementById("registerFormElement")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      const studentId = document.getElementById("studentId").value;
      const gradeLevel = document.getElementById("gradeLevel").value;
      const classroom = document.getElementById("classroom").value;
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      let isValid = true;

      if (!studentId.trim()) {
        showError("studentId", "กรุณากรอกรหัสนักเรียน");
        isValid = false;
      } else if (!validateStudentId(studentId)) {
        showError("studentId", "รหัสนักเรียนต้องขึ้นต้นด้วย 4 และมี 5 หลัก");
        isValid = false;
      } else {
        showSuccess("studentId");
      }

      if (!gradeLevel) {
        showError("gradeLevel", "กรุณาเลือกชั้น");
        isValid = false;
      } else {
        showSuccess("gradeLevel");
      }

      if (!classroom) {
        showError("classroom", "กรุณาเลือกห้อง");
        isValid = false;
      } else {
        showSuccess("classroom");
      }

      if (!email) {
        showError("registerEmail", "กรุณากรอกอีเมล");
        isValid = false;
      } else if (!validateEmail(email)) {
        showError("registerEmail", "กรุณากรอกอีเมลให้ถูกต้อง");
        isValid = false;
      } else {
        showSuccess("registerEmail");
      }

      if (!password) {
        showError("registerPassword", "กรุณากรอกรหัสผ่าน");
        isValid = false;
      } else if (!validatePassword(password)) {
        showError("registerPassword", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
        isValid = false;
      } else {
        showSuccess("registerPassword");
      }

      if (!confirmPassword) {
        showError("confirmPassword", "กรุณายืนยันรหัสผ่าน");
        isValid = false;
      } else if (password !== confirmPassword) {
        showError("confirmPassword", "รหัสผ่านไม่ตรงกัน");
        isValid = false;
      } else {
        showSuccess("confirmPassword");
      }

      if (isValid) {
        const registerBtn = document.getElementById("registerBtn");
        const originalText = registerBtn.textContent;
        registerBtn.textContent = "กำลังสร้างบัญชี...";
        registerBtn.disabled = true;

        registerUser(studentId, gradeLevel, classroom, email, password).finally(
          () => {
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
          }
        );
      }
    });

  document
    .getElementById("gradeLevel")
    .addEventListener("change", function (e) {
      const selectedGrade = e.target.value;
      updateClassroomOptions(selectedGrade);

      const classroomSelect = document.getElementById("classroom");
      classroomSelect.classList.remove("error", "success");
      const classroomError = document.getElementById("classroomError");
      classroomError.style.display = "none";
    });

  document
    .getElementById("confirmPassword")
    .addEventListener("input", function (e) {
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = e.target.value;

      if (confirmPassword && password !== confirmPassword) {
        showError("confirmPassword", "รหัสผ่านไม่ตรงกัน");
      } else if (confirmPassword && password === confirmPassword) {
        showSuccess("confirmPassword");
      }
    });

  document.getElementById("studentId").addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").substring(0, 5);
  });
});

showLogin();
