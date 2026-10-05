// ===== STUDENT RESULT PORTAL: easy version =====
// Idea: choose course -> subjects load -> type marks -> check -> calculate -> show result.

// Step 1: course data. Each subject is [name, maximum marks].
// Add your own course by copying one line and changing it.
var courses = {
  "B.Sc Computer Science": [["Programming", 100], ["Data Structures", 100], ["Databases", 100], ["Mathematics", 75], ["Practical Lab", 50]],
  "B.Com": [["Accounting", 100], ["Economics", 100], ["Business Law", 75], ["Statistics", 75]],
  "B.A English": [["Poetry", 100], ["Drama", 100], ["Fiction", 100], ["Linguistics", 80], ["Literary History", 60], ["Viva", 40]],
  "Other (type my own subjects)": []
};

var SUBJECT_PASS_PERCENT = 35; // pass mark for each subject
var OVERALL_PASS_PERCENT = 40; // pass mark overall

// Step 2: connect JavaScript to the HTML using ids
var form = document.getElementById("studentForm");
var courseBox = document.getElementById("course");
var subjectList = document.getElementById("subjectList");
var resultBox = document.getElementById("result");
var table = document.getElementById("resultTable");

// Step 3: fill the course drop-down from the data above
courseBox.innerHTML = '<option value="">Choose a course</option>';
for (var courseName in courses) {
  courseBox.innerHTML += "<option>" + courseName + "</option>";
}

// Step 4: helper functions
function showError(id, message) {
  document.getElementById(id).textContent = message;
}
function clearErrors() {
  var errors = document.querySelectorAll(".text-danger");
  for (var i = 0; i < errors.length; i++) {
    errors[i].textContent = "";
  }
}

// Adds one subject row (name, marks scored, maximum marks)
function addSubjectRow(name, max) {
  var row = document.createElement("div");
  row.className = "row g-2 mb-2 subject-row";
  row.innerHTML =
    '<div class="col-5"><input class="form-control sub-name" placeholder="Subject" value="' + name + '"></div>' +
    '<div class="col-3"><input type="number" class="form-control sub-marks" placeholder="Marks"></div>' +
    '<div class="col-3"><input type="number" class="form-control sub-max" placeholder="Max" value="' + max + '"></div>' +
    '<div class="col-1"><button type="button" class="btn btn-sm btn-outline-danger remove-btn" title="Remove subject">x</button></div>';
  subjectList.appendChild(row);
}

// Step 5: when the course changes, load its subjects
courseBox.addEventListener("change", function () {
  subjectList.innerHTML = ""; // remove old rows
  var chosen = courses[courseBox.value];
  if (chosen === undefined) {
    subjectList.innerHTML = '<p class="text-muted">Choose a course to load its subjects.</p>';
    return;
  }
  if (chosen.length === 0) {
    addSubjectRow("", ""); // "Other" course: start with one empty row
  }
  for (var i = 0; i < chosen.length; i++) {
    addSubjectRow(chosen[i][0], chosen[i][1]);
  }
});

// "+ Add subject" button
document.getElementById("addSubject").addEventListener("click", function () {
  if (subjectList.querySelector(".subject-row") === null) {
    subjectList.innerHTML = ""; // remove the "Choose a course" text
  }
  addSubjectRow("", "");
});

// The red "x" button removes its row
subjectList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    event.target.parentElement.parentElement.remove();
  }
});

// Step 6: run when the user clicks "Calculate result"
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page reloading
  clearErrors();
  var valid = true;

  var name = document.getElementById("name").value.trim();
  var roll = document.getElementById("roll").value.trim();
  var email = document.getElementById("email").value.trim();
  var course = courseBox.value;

  // Validate the personal details
  if (name === "") { showError("nameError", "Please enter your name."); valid = false; }
  if (roll === "") { showError("rollError", "Please enter your roll number."); valid = false; }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    showError("emailError", "Enter a valid email, like name@mail.com"); valid = false;
  }
  if (course === "") { showError("courseError", "Please choose a course."); valid = false; }

  // Validate every subject row
  var rows = document.querySelectorAll(".subject-row");
  var subjects = [];
  if (rows.length === 0 && course !== "") {
    showError("marksError", "Add at least one subject."); valid = false;
  }
  for (var i = 0; i < rows.length; i++) {
    var subName = rows[i].querySelector(".sub-name").value.trim();
    var marksText = rows[i].querySelector(".sub-marks").value;
    var maxText = rows[i].querySelector(".sub-max").value;
    var marks = Number(marksText);
    var max = Number(maxText);

    if (subName === "" || marksText === "" || maxText === "" || max <= 0 || marks < 0 || marks > max) {
      showError("marksError", "Every subject needs a name, a maximum above 0, and marks from 0 to the maximum.");
      valid = false;
    }
    subjects.push({ name: subName, marks: marks, max: max });
  }

  if (valid === false) {
    return; // stop, the user must fix the errors
  }

  // Step 7: calculate total, maximum and percentage
  var total = 0;
  var totalMax = 0;
  var failedSubject = false;
  var lines = "";
  for (var j = 0; j < subjects.length; j++) {
    var s = subjects[j];
    total = total + s.marks;
    totalMax = totalMax + s.max;
    var subjectPass = s.marks >= s.max * SUBJECT_PASS_PERCENT / 100;
    if (subjectPass === false) {
      failedSubject = true;
    }
    lines += "<tr><td>" + s.name + "</td><td>" + s.marks + " / " + s.max + "</td><td>" +
      (subjectPass ? "Pass" : "Below " + SUBJECT_PASS_PERCENT + "%") + "</td></tr>";
  }
  var percentage = total / totalMax * 100;

  // Step 8: decide Pass or Fail
  var status = "PASS";
  var color = "success";
  if (failedSubject === true || percentage < OVERALL_PASS_PERCENT) {
    status = "FAIL";
    color = "danger";
  }

  // Step 9: show the result on the page
  resultBox.className = "alert alert-" + color;
  resultBox.innerHTML =
    "<h4>" + name + " (" + roll + ")</h4>" +
    "<p>Course: " + course + "</p>" +
    '<table class="table table-sm bg-white"><tbody>' + lines + "</tbody></table>" +
    "<p>Total: " + total + " / " + totalMax + "</p>" +
    "<p>Percentage: " + percentage.toFixed(2) + "%</p>" +
    "<h5>Result: " + status + "</h5>";

  // Step 10: add a row to the results table
  var row = table.insertRow();
  row.insertCell().textContent = name;
  row.insertCell().textContent = course;
  row.insertCell().textContent = total + " / " + totalMax;
  row.insertCell().textContent = percentage.toFixed(1) + "%";
  row.insertCell().textContent = status;
});