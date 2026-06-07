const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const restart = document.querySelector("#restart");

let player;
let blocks;
let keys;
let score;
let dead;
let lastBlock;

function reset() {
  player = { x: 180, y: 352, w: 40, h: 24, speed: 5 };
  blocks = [];
  keys = {};
  score = 0;
  dead = false;
  lastBlock = 0;
  scoreEl.textContent = score;
}

function hit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function loop(now) {
  if (!dead) {
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

    if (now - lastBlock > 520) {
      blocks.push({ x: Math.random() * 360, y: -30, w: 28 + Math.random() * 38, h: 24, speed: 2.2 + Math.random() * 2.4 });
      lastBlock = now;
    }

    for (const block of blocks) block.y += block.speed;
    blocks = blocks.filter((block) => {
      if (block.y > canvas.height) {
        score += 1;
        scoreEl.textContent = score;
        return false;
      }
      return true;
    });

    if (blocks.some((block) => hit(player, block))) dead = true;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#3ddc97";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = "#ff6868";
  for (const block of blocks) ctx.fillRect(block.x, block.y, block.w, block.h);

  if (dead) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f4f7fb";
    ctx.font = "700 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

restart.addEventListener("click", reset);
reset();
requestAnimationFrame(loop);
