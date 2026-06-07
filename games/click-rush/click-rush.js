const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const timeEl = document.querySelector("#time");
const start = document.querySelector("#start");

let target = { x: 200, y: 200, r: 34 };
let score = 0;
let time = 20;
let running = false;
let timer;

function moveTarget() {
  target = {
    x: 42 + Math.random() * (canvas.width - 84),
    y: 42 + Math.random() * (canvas.height - 84),
    r: 26 + Math.random() * 16,
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffcf56";
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111318";
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r * 0.38, 0, Math.PI * 2);
  ctx.fill();
}

function begin() {
  score = 0;
  time = 20;
  running = true;
  scoreEl.textContent = score;
  timeEl.textContent = time;
  moveTarget();
  draw();
  clearInterval(timer);
  timer = setInterval(() => {
    time -= 1;
    timeEl.textContent = time;
    if (time <= 0) {
      running = false;
      clearInterval(timer);
    }
  }, 1000);
}

canvas.addEventListener("click", (event) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  const distance = Math.hypot(x - target.x, y - target.y);
  if (distance <= target.r) {
    score += 1;
    scoreEl.textContent = score;
    moveTarget();
    draw();
  }
});

start.addEventListener("click", begin);
draw();
