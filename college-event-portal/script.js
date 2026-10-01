// College Event Portal
const EVENTS_KEY = "collegeEvents";
const REGS_KEY = "eventRegistrations";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const eventList = document.getElementById("eventList");
const emptyEvents = document.getElementById("emptyEvents");
const addEventForm = document.getElementById("addEventForm");
const newEventName = document.getElementById("newEventName");
const eventDate = document.getElementById("eventDate");
const eventVenue = document.getElementById("eventVenue");
const addEventError = document.getElementById("addEventError");
const eventForm = document.getElementById("eventForm");
const participant = document.getElementById("participant");
const emailInput = document.getElementById("email");
const eventSelect = document.getElementById("eventSelect");
const registerError = document.getElementById("registerError");
const confirmation = document.getElementById("confirmation");
const regTable = document.getElementById("regTable");
const regBody = document.getElementById("regBody");
const emptyRegs = document.getElementById("emptyRegs");

// Both lists start empty and are filled by the user
let events = load(EVENTS_KEY);
let registrations = load(REGS_KEY);

// ---------- saving in the browser ----------
function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    localStorage.setItem(REGS_KEY, JSON.stringify(registrations));
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

function newId() {
  return Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

// Today as YYYY-MM-DD (same format the date input uses)
function todayString() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// An event is open for registration until its date has passed
function isUpcoming(ev) {
  return ev.date >= todayString();
}

// ---------- showing things on the page ----------
function renderEvents() {
  eventList.innerHTML = "";
  emptyEvents.classList.toggle("hidden", events.length > 0);

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach((ev) => {
    const upcoming = isUpcoming(ev);
    const count = registrations.filter((r) => r.eventId === ev.id).length;

    const card = make("div", undefined, "card event-card");
    card.append(
      make("h3", ev.name),
      make("p", "Date: " + formatDate(ev.date)),
      make("p", "Venue: " + ev.venue),
      make("p", upcoming ? `${count} registered` : `Registration closed · ${count} registered`)
    );

    if (upcoming) {
      const registerBtn = make("button", "Register");
      registerBtn.addEventListener("click", () => {
        eventSelect.value = ev.id; // pre-select this event in the form
        const section = document.getElementById("registration");
        if (section.scrollIntoView) section.scrollIntoView({ behavior: "smooth" });
        participant.focus();
      });
      card.appendChild(registerBtn);
    }

    const deleteBtn = make("button", "Delete", "danger");
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete "${ev.name}" and its registrations?`)) {
        events = events.filter((e) => e.id !== ev.id);
        registrations = registrations.filter((r) => r.eventId !== ev.id);
        save();
        renderAll();
      }
    });
    card.appendChild(deleteBtn);

    eventList.appendChild(card);
  });
}

// The dropdown only lists events that are still open
function renderSelect() {
  const previous = eventSelect.value;
  eventSelect.innerHTML = "";
  const open = events.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));

  if (open.length === 0) {
    const option = make("option", "No upcoming events");
    option.value = "";
    eventSelect.appendChild(option);
    eventSelect.disabled = true;
    return;
  }

  eventSelect.disabled = false;
  const placeholder = make("option", "Select an event");
  placeholder.value = "";
  eventSelect.appendChild(placeholder);
  open.forEach((ev) => {
    const option = make("option", `${ev.name} (${formatDate(ev.date)})`);
    option.value = ev.id;
    eventSelect.appendChild(option);
  });
  eventSelect.value = open.some((ev) => ev.id === previous) ? previous : "";
}

function renderRegistrations() {
  regBody.innerHTML = "";
  emptyRegs.classList.toggle("hidden", registrations.length > 0);
  regTable.classList.toggle("hidden", registrations.length === 0);

  registrations.forEach((r) => {
    const ev = events.find((e) => e.id === r.eventId);
    const tr = make("tr");
    [r.name, r.email, ev ? ev.name : "(deleted event)"].forEach((v) => tr.appendChild(make("td", v)));

    const cancelBtn = make("button", "Cancel", "danger");
    cancelBtn.addEventListener("click", () => {
      if (confirm(`Cancel the registration of ${r.name}?`)) {
        registrations = registrations.filter((x) => x.id !== r.id);
        save();
        renderAll();
      }
    });
    const td = make("td");
    td.appendChild(cancelBtn);
    tr.appendChild(td);
    regBody.appendChild(tr);
  });
}

function renderAll() {
  renderEvents();
  renderSelect();
  renderRegistrations();
}

// ---------- add an event ----------
addEventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = newEventName.value.trim();
  const date = eventDate.value;
  const venue = eventVenue.value.trim();

  if (!name || !date || !venue) {
    addEventError.textContent = "Please fill in the event name, date and venue.";
    return;
  }
  if (date < todayString()) {
    addEventError.textContent = "The event date cannot be in the past.";
    return;
  }
  if (events.some((ev) => ev.name.toLowerCase() === name.toLowerCase() && ev.date === date)) {
    addEventError.textContent = "This event is already added for that date.";
    return;
  }

  addEventError.textContent = "";
  events.push({ id: newId(), name, date, venue });
  save();
  renderAll();
  addEventForm.reset();
});

// ---------- register for an event ----------
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  confirmation.innerHTML = "";

  const name = participant.value.trim();
  const email = emailInput.value.trim();
  const eventId = eventSelect.value;

  if (!name || !email || !eventId) {
    registerError.textContent = "Please fill in your name, email and choose an event.";
    return;
  }
  if (!EMAIL_PATTERN.test(email)) {
    registerError.textContent = "Please enter a valid email address.";
    return;
  }
  const ev = events.find((x) => x.id === eventId);
  if (!ev || !isUpcoming(ev)) {
    registerError.textContent = "This event is not open for registration.";
    return;
  }
  if (registrations.some((r) => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase())) {
    registerError.textContent = "This email is already registered for this event.";
    return;
  }

  registerError.textContent = "";
  registrations.push({ id: newId(), name, email, eventId });
  save();
  renderAll();

  confirmation.append(
    make("p", "Registration successful!", "success"),
    make("p", `Name: ${name}`),
    make("p", `Email: ${email}`),
    make("p", `Event: ${ev.name} on ${formatDate(ev.date)} at ${ev.venue}`)
  );
  eventForm.reset();
  renderSelect();
});

// ---------- start ----------
eventDate.min = todayString(); // the date picker will not allow past dates
renderAll();
