// Student Registration & Result Portal
const STORAGE_KEY = "registeredStudents";
const PASS_PERCENTAGE = 40; // overall percentage needed to pass

const form = document.getElementById("registrationForm");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const courseInput = document.getElementById("course");
const subjectsContainer = document.getElementById("subjectsContainer");
const formError = document.getElementById("formError");
const resultSection = document.getElementById("resultSection");
const resultBox = document.getElementById("result");
const studentsTable = document.getElementById("studentsTable");
const studentsBody = document.getElementById("studentsBody");
const emptyMessage = document.getElementById("emptyMessage");

let students = loadStudents(); // starts empty, filled by the user

// ---------- saving in the browser ----------
function loadStudents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    // saving is optional, the page still works without it
  }
}

// ---------- small helpers ----------
// Makes an element with safe text. textContent never runs HTML typed by a user.
function make(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}

function makeInput(type, placeholder) {
  const input = make("input");
  input.type = type;
  input.placeholder = placeholder;
  input.setAttribute("aria-label", placeholder);
  if (type === "number") input.min = "0";
  return input;
}

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 75) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= PASS_PERCENTAGE) return "C";
  return "F";
}

// ---------- subject rows ----------
function addSubjectRow() {
  const row = make("div", undefined, "subject-row");
  const removeBtn = make("button", "Remove", "secondary");
  removeBtn.type = "button";
  removeBtn.addEventListener("click", () => {
    row.remove();
    updateRemoveButtons();
  });
  row.append(
    makeInput("text", "Subject Name"),
    makeInput("number", "Marks Obtained"),
    makeInput("number", "Maximum Marks"),
    removeBtn
  );
  subjectsContainer.appendChild(row);
  updateRemoveButtons();
}

// A student needs at least one subject, so the last Remove button is switched off
function updateRemoveButtons() {
  const rows = subjectsContainer.querySelectorAll(".subject-row");
  rows.forEach((row) => {
    row.querySelector("button").disabled = rows.length === 1;
  });
}

function readSubjects() {
  return Array.from(subjectsContainer.querySelectorAll(".subject-row")).map((row) => {
    const inputs = row.querySelectorAll("input");
    return {
      subject: inputs[0].value.trim(),
      obtained: inputs[1].value.trim(),
      max: inputs[2].value.trim(),
    };
  });
}

// ---------- checking the form ----------
// Returns an error message, or "" if everything is fine
function validate(name, roll, course, subjects) {
  if (!name || !roll || !course) return "Please fill in the name, roll no and course.";
  if (students.some((s) => s.roll.toLowerCase() === roll.toLowerCase())) {
    return "This roll number is already registered.";
  }
  for (let i = 0; i < subjects.length; i++) {
    const s = subjects[i];
    const n = i + 1;
    if (!s.subject) return `Subject ${n}: please enter the subject name.`;
    if (s.obtained === "" || s.max === "") {
      return `Subject ${n}: please enter the marks obtained and the maximum marks.`;
    }
    const obtained = Number(s.obtained);
    const max = Number(s.max);
    if (Number.isNaN(obtained) || Number.isNaN(max)) return `Subject ${n}: marks must be numbers.`;
    if (max <= 0) return `Subject ${n}: maximum marks must be more than 0.`;
    if (obtained < 0 || obtained > max) return `Subject ${n}: marks obtained must be between 0 and ${max}.`;
  }
  return "";
}

// ---------- showing things on the page ----------
function showResult(student) {
  resultBox.innerHTML = "";

  const table = make("table");
  const head = make("tr");
  ["Subject", "Marks Obtained", "Maximum Marks"].forEach((t) => head.appendChild(make("th", t)));
  table.appendChild(head);
  student.subjects.forEach((sub) => {
    const tr = make("tr");
    [sub.subject, sub.obtained, sub.max].forEach((v) => tr.appendChild(make("td", v)));
    table.appendChild(tr);
  });
  const wrap = make("div", undefined, "table-wrap");
  wrap.appendChild(table);

  resultBox.append(
    make("p", `Name: ${student.name}`),
    make("p", `Roll No: ${student.roll}`),
    make("p", `Course: ${student.course}`),
    wrap,
    make("p", `Total: ${student.totalObtained} / ${student.totalMax}`),
    make("p", `Percentage: ${student.percentage}%`),
    make("p", `Grade: ${student.grade}`),
    make("p", `Result: ${student.passed ? "Pass" : "Fail"}`, student.passed ? "pass" : "fail"),
    make("p", `Pass mark is ${PASS_PERCENTAGE}% overall.`, "note")
  );

  resultSection.classList.remove("hidden");
  if (resultSection.scrollIntoView) resultSection.scrollIntoView({ behavior: "smooth" });
}

function renderStudents() {
  studentsBody.innerHTML = "";
  emptyMessage.classList.toggle("hidden", students.length > 0);
  studentsTable.classList.toggle("hidden", students.length === 0);

  students.forEach((s) => {
    const tr = make("tr");
    [s.roll, s.name, s.course, s.percentage + "%", s.grade].forEach((v) => tr.appendChild(make("td", v)));
    tr.appendChild(make("td", s.passed ? "Pass" : "Fail", s.passed ? "pass" : "fail"));

    const removeBtn = make("button", "Remove", "danger");
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove ${s.name} (${s.roll})?`)) {
        students = students.filter((x) => x.roll !== s.roll);
        saveStudents();
        renderStudents();
        resultSection.classList.add("hidden");
      }
    });
    const td = make("td");
    td.appendChild(removeBtn);
    tr.appendChild(td);

    studentsBody.appendChild(tr);
  });
}

// ---------- events ----------
document.getElementById("addSubject").addEventListener("click", addSubjectRow);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();
  const course = courseInput.value.trim();
  const rawSubjects = readSubjects();

  const error = validate(name, roll, course, rawSubjects);
  if (error) {
    formError.textContent = error;
    return;
  }
  formError.textContent = "";

  const subjects = rawSubjects.map((s) => ({
    subject: s.subject,
    obtained: Number(s.obtained),
    max: Number(s.max),
  }));
  const totalObtained = subjects.reduce((sum, s) => sum + s.obtained, 0);
  const totalMax = subjects.reduce((sum, s) => sum + s.max, 0);
  const percentage = Math.round((totalObtained / totalMax) * 10000) / 100; // 2 decimal places

  const student = {
    roll, name, course, subjects, totalObtained, totalMax, percentage,
    grade: getGrade(percentage),
    passed: percentage >= PASS_PERCENTAGE,
  };

  students.push(student);
  saveStudents();
  renderStudents();
  showResult(student);

  // get the form ready for the next student
  form.reset();
  subjectsContainer.innerHTML = "";
  addSubjectRow();
});

// ---------- start ----------
addSubjectRow();
renderStudents();
