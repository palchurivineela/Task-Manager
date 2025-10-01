const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressFill = document.querySelector(".progress-bar-fill");
const progressText = document.querySelector(".progress-text");
const themeToggle = document.getElementById("themeToggle");
const congratsPopup = document.getElementById("congratsPopup");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDark = JSON.parse(localStorage.getItem("darkMode")) || false;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.name}</span>
      <div class="actions">
        <button class="complete-btn">${task.completed ? "Undo" : "Done"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Complete/Undo
    li.querySelector(".complete-btn").addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Edit
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newName = prompt("Edit task:", task.name);
      if (newName) {
        tasks[index].name = newName;
        saveTasks();
        renderTasks();
      }
    });

    // Delete
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
  updateProgress();
}

function updateProgress() {
  if (tasks.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0% completed";
    return;
  }
  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = Math.round((completedTasks / tasks.length) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "% completed";

  // Show celebration if all tasks completed
  if (completedTasks === tasks.length && tasks.length > 0) {
    showCelebration();
  }
}

function showCelebration() {
  congratsPopup.classList.remove("hidden");
  setTimeout(() => congratsPopup.classList.add("hidden"), 3000);
  createConfettiBlast("left");
  createConfettiBlast("right");
}

// Confetti blast from corners
function createConfettiBlast(side) {
  const colors = ["#f44336", "#ffeb3b", "#4caf50", "#2196f3", "#ff9800", "#9c27b0"];
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = side === "left" ? "0px" : window.innerWidth - 10 + "px";
    confetti.style.bottom = "0px";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);

    const angle = side === "left" ? Math.random() * 60 : 180 - Math.random() * 60;
    const distance = Math.random() * 400 + 300;
    const duration = Math.random() * 2000 + 1500;

    confetti.animate([
      { transform: `translate(0,0) rotate(${Math.random() * 360}deg)` },
      { transform: `translate(${Math.cos(angle * Math.PI / 180) * distance}px, -${Math.sin(angle * Math.PI / 180) * distance}px) rotate(${Math.random() * 720}deg)` }
    ], {
      duration: duration,
      easing: "ease-out",
      iterations: 1,
      fill: "forwards"
    });

    setTimeout(() => confetti.remove(), duration);
  }
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskName = taskInput.value.trim();
  if (taskName === "") return;
  tasks.push({ name: taskName, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// Theme toggle
function applyTheme() {
  if (isDark) {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("darkMode", JSON.stringify(isDark));
}

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  applyTheme();
});

// Initial load
applyTheme();
renderTasks();
