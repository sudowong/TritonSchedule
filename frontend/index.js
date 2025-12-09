const courses = [
  {
    code: "CSE 100",
    title: "Advanced Data Structures",
    professor: "Chen",
    times: [
      { day: "Mon", start: "10:00", end: "10:50" },
      { day: "Wed", start: "10:00", end: "10:50" },
      { day: "Fri", start: "10:00", end: "10:50" },
    ],
  },
  {
    code: "CSE 110",
    title: "Software Engineering",
    professor: "Patel",
    times: [
      { day: "Tue", start: "14:00", end: "15:20" },
      { day: "Thu", start: "14:00", end: "15:20" },
    ],
  },
  {
    code: "MATH 20C",
    title: "Vector Calculus",
    professor: "Nguyen",
    times: [
      { day: "Mon", start: "13:00", end: "13:50" },
      { day: "Wed", start: "13:00", end: "13:50" },
      { day: "Fri", start: "13:00", end: "13:50" },
    ],
  },
  {
    code: "COGS 108",
    title: "Data Science in Practice",
    professor: "Lopez",
    times: [
      { day: "Tue", start: "09:30", end: "10:50" },
      { day: "Thu", start: "09:30", end: "10:50" },
    ],
  },
  {
    code: "ECE 101",
    title: "Linear Systems",
    professor: "Sanchez",
    times: [
      { day: "Mon", start: "15:00", end: "16:20" },
      { day: "Wed", start: "15:00", end: "16:20" },
    ],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const startHour = 8;
const endHour = 18;

const courseList = document.getElementById("course-list");
const searchInput = document.getElementById("course-search");
const selectedList = document.getElementById("selected-list");
const scheduleGrid = document.getElementById("schedule-grid");
const clearButton = document.getElementById("clear-schedule");
let currentTimeLine = null;
let currentTimeLabel = null;

let added = [];

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTimes(course) {
  return course.times.map((t) => `${t.day} ${t.start}-${t.end}`).join(" • ");
}

function renderResults(list) {
  courseList.innerHTML = list
    .map(
      (course) => `
      <article class="course-card" data-code="${course.code}">
        <div>
          <p class="meta">${course.professor}</p>
          <h3>${course.code} — ${course.title}</h3>
          <p class="meta">${formatTimes(course)}</p>
        </div>
        <button data-add="${course.code}">Add</button>
      </article>`
    )
    .join("");
}

function renderSelected() {
  if (!added.length) {
    selectedList.innerHTML = '<li class="meta">No classes added yet.</li>';
    return;
  }

  selectedList.innerHTML = added
    .map(
      (course) => `
      <li>
        <div>
          <strong>${course.code}</strong> — ${course.title}
          <div class="meta">${formatTimes(course)}</div>
        </div>
        <button data-remove="${course.code}">Remove</button>
      </li>`
    )
    .join("");
}

function buildScheduleGrid() {
  const labels = days.map((d) => `<div class="day-cell">${d}</div>`).join("");
  const columns = days
    .map(
      (d) => `
      <div class="day-column" data-day="${d}">
        <div class="day-body"></div>
      </div>`
    )
    .join("");

  scheduleGrid.innerHTML = `
    <div class="day-row">${labels}</div>
    <div class="day-columns">${columns}</div>
  `;
}

function renderSchedule() {
  const bodies = {};
  scheduleGrid.querySelectorAll(".day-column").forEach((col) => {
    const day = col.dataset.day;
    const body = col.querySelector(".day-body");
    body.innerHTML = "";
    bodies[day] = body;
  });

  const totalMinutes = (endHour - startHour) * 60;

  const pxPerMinute = scheduleGrid
    .querySelector(".day-body")
    ?.getBoundingClientRect().height
    ? scheduleGrid.querySelector(".day-body").getBoundingClientRect().height /
      totalMinutes
    : 0;

  added.forEach((course) => {
    course.times.forEach((slot) => {
      const body = bodies[slot.day];
      if (!body) return;

      const start = timeToMinutes(slot.start);
      const end = timeToMinutes(slot.end);
      const duration = end - start;
      const topPx = (start - startHour * 60) * pxPerMinute;
      const heightPx = Math.max(duration * pxPerMinute, 48); // ensure touch-friendly minimum height

      const block = document.createElement("div");
      block.className = "event";
      block.style.top = `${topPx}px`;
      block.style.height = `${heightPx}px`;
      block.innerHTML = `
        <div class="event-top">
          <strong>${course.code}</strong>
          <span class="event-time">${slot.start}–${slot.end}</span>
        </div>
        <div class="event-title">${course.title}</div>
      `;
      body.appendChild(block);

      // If the content needs more space, expand the block so text never disappears.
      const needed = block.scrollHeight;
      if (needed > heightPx) {
        block.style.height = `${needed}px`;
      }
    });
  });

  renderNowLine(bodies, totalMinutes);
}

function addCourse(code) {
  const course = courses.find((c) => c.code === code);
  if (!course) return;
  if (added.some((c) => c.code === course.code)) return;
  added.push(course);
  renderSelected();
  renderSchedule();
}

function removeCourse(code) {
  added = added.filter((c) => c.code !== code);
  renderSelected();
  renderSchedule();
}

function handleSearch(event) {
  const term = event.target.value.toLowerCase();
  const filtered = courses.filter((c) =>
    c.code.toLowerCase().includes(term) ||
    c.title.toLowerCase().includes(term) ||
    c.professor.toLowerCase().includes(term)
  );
  renderResults(filtered);
}

function bindEvents() {
  courseList.addEventListener("click", (e) => {
    const code = e.target.getAttribute("data-add");
    if (code) addCourse(code);
  });

  selectedList.addEventListener("click", (e) => {
    const code = e.target.getAttribute("data-remove");
    if (code) removeCourse(code);
  });

  searchInput.addEventListener("input", handleSearch);

  clearButton.addEventListener("click", () => {
    added = [];
    renderSelected();
    renderSchedule();
  });

  window.addEventListener("resize", () => renderSchedule());
}

function init() {
  buildScheduleGrid();
  renderResults(courses);
  renderSelected();
  renderSchedule();
  bindEvents();
  setInterval(renderSchedule, 60 * 1000); // keep the "now" line in sync
}

init();

function renderNowLine(bodies, totalMinutes) {
  const today = new Date();
  const dayName = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .replace(".", "");
  const body = bodies[dayName];

  // Remove line if day is out of range or body missing
  if (!body || today.getHours() >= endHour || today.getHours() < startHour) {
    if (currentTimeLine) {
      currentTimeLine.remove();
      currentTimeLine = null;
    }
    if (currentTimeLabel) {
      currentTimeLabel.remove();
      currentTimeLabel = null;
    }
    return;
  }

  const minutesNow = today.getHours() * 60 + today.getMinutes();
  const minutesIntoDay = minutesNow - startHour * 60;
  const pxPerMinute =
    body.getBoundingClientRect().height && totalMinutes
      ? body.getBoundingClientRect().height / totalMinutes
      : 0;
  const top = minutesIntoDay * pxPerMinute;

  if (!currentTimeLine) {
    currentTimeLine = document.createElement("div");
    currentTimeLine.className = "current-time-line";
    body.appendChild(currentTimeLine);
  }
  if (!currentTimeLabel) {
    currentTimeLabel = document.createElement("div");
    currentTimeLabel.className = "current-time-label";
    body.appendChild(currentTimeLabel);
  }

  currentTimeLine.style.top = `${top}px`;
  currentTimeLabel.style.top = `${top - 12}px`;
  currentTimeLabel.textContent = today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
