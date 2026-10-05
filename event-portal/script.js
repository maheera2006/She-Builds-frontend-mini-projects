// ===== COLLEGE EVENT PORTAL: easy version =====
// Each section below does one small job.

// ---------- Helper: show or clear a red error message ----------
function setError(id, message) {
  document.getElementById(id).textContent = message;
}
function isEmpty(id) {
  return document.getElementById(id).value.trim() === "";
}

// ---------- 1. Menu button (phones) ----------
var menuBtn = document.getElementById("menuBtn");
var links = document.getElementById("links");
menuBtn.addEventListener("click", function () {
  links.classList.toggle("open"); // adds or removes the class "open"
});

// ---------- 2. Add announcement ----------
document.getElementById("annBtn").addEventListener("click", function () {
  var box = document.getElementById("annText");
  if (box.value.trim() === "") {
    return; // nothing typed, do nothing
  }
  var item = document.createElement("li"); // make a new <li>
  item.textContent = box.value;
  document.getElementById("annList").prepend(item); // put it on top
  box.value = "";
});

// ---------- 3. Filter events by category ----------
var filterButtons = document.querySelectorAll(".filters button");
var cards = document.querySelectorAll("#cards .card");

for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    var chosen = this.getAttribute("data-cat");

    // highlight only the clicked button
    for (var a = 0; a < filterButtons.length; a++) {
      filterButtons[a].classList.remove("on");
    }
    this.classList.add("on");

    // show matching cards, hide the rest
    for (var b = 0; b < cards.length; b++) {
      var category = cards[b].getAttribute("data-category");
      if (chosen === "All" || chosen === category) {
        cards[b].style.display = "block";
      } else {
        cards[b].style.display = "none";
      }
    }
  });
}

// ---------- 4. "Register" button on a card ----------
var regButtons = document.querySelectorAll(".reg-btn");
for (var r = 0; r < regButtons.length; r++) {
  regButtons[r].addEventListener("click", function () {
    document.getElementById("rv").value = this.getAttribute("data-event");
    document.getElementById("register").scrollIntoView(); // jump to the form
  });
}

// ---------- 5. Registration form validation ----------
document.getElementById("regForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var valid = true;
  var ok = document.getElementById("ok");
  ok.hidden = true;

  var name = document.getElementById("rn").value.trim();
  var email = document.getElementById("re").value.trim();
  var mobile = document.getElementById("rm").value.trim();

  // clear old messages first
  setError("rnErr", ""); setError("reErr", ""); setError("rmErr", "");
  setError("rdErr", ""); setError("ryErr", ""); setError("rvErr", "");

  if (name === "") { setError("rnErr", "Please enter your name."); valid = false; }
  if (email.indexOf("@") === -1) { setError("reErr", "Enter a valid email."); valid = false; }
  if (mobile.length !== 10 || isNaN(mobile)) { setError("rmErr", "Enter exactly 10 digits."); valid = false; }
  if (isEmpty("rd")) { setError("rdErr", "Please enter your department."); valid = false; }
  if (document.getElementById("ry").value === "") { setError("ryErr", "Select your year."); valid = false; }
  if (document.getElementById("rv").value === "") { setError("rvErr", "Select an event."); valid = false; }

  if (valid === false) {
    return;
  }

  // success message
  ok.textContent = "Thank you " + name + "! You are registered for " + document.getElementById("rv").value + ".";
  ok.hidden = false;
  this.reset(); // clear the form
});

// ---------- 6. Contact form validation ----------
document.getElementById("cForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var valid = true;
  setError("cnErr", ""); setError("cmErr", "");
  var done = document.getElementById("cok");
  done.hidden = true;

  if (isEmpty("cn")) { setError("cnErr", "Please enter your name."); valid = false; }
  if (isEmpty("cm")) { setError("cmErr", "Please write a message."); valid = false; }

  if (valid) {
    done.textContent = "Message sent. We will reply soon.";
    done.hidden = false;
    this.reset();
  }
});
