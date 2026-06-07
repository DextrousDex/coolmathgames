const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const restart = document.querySelector("#restart");
const cells = 20;
const size = canvas.width / cells;

let snake;
let food;
let direction;
let nextDirection;
let score;
let dead;

function placeFood() {
  food = {
    x: Math.floor(Math.random() * cells),
    y: Math.floor(Math.random() * cells),
  };
  if (snake.some((part) => part.x === food.x && part.y === food.y)) placeFood();
}

function reset() {
  snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  dead = false;
  scoreEl.textContent = score;
  placeFood();
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
}

function tick() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  const crashed =
    head.x < 0 ||
    head.y < 0 ||
    head.x >= cells ||
    head.y >= cells ||
    snake.some((part) => part.x === head.x && part.y === head.y);

  if (crashed) dead = true;

  if (!dead) {
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCell(food.x, food.y, "#ffcf56");
  snake.forEach((part, index) => drawCell(part.x, part.y, index ? "#3ddc97" : "#f4f7fb"));

  if (dead) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f4f7fb";
    ctx.font = "700 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

document.addEventListener("keydown", (event) => {
  const turns = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  const turn = turns[event.key];
  if (!turn) return;
  event.preventDefault();
  if (turn.x !== -direction.x || turn.y !== -direction.y) nextDirection = turn;
});

restart.addEventListener("click", reset);
reset();
setInterval(tick, 120);
