const bootScreen = document.querySelector("#bootScreen");
const search = document.querySelector("#gameSearch");
const gamesGrid = document.querySelector("#gamesGrid");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const emptyState = document.querySelector("#emptyState");
const libraryStat = document.querySelector("#libraryStat");
const heroCount = document.querySelector("#heroCount");

const PACK_API = "https://api.github.com/repos/CoolDude2349/Offline-HTML-Games-Pack/contents/offline?ref=master";
const EXCLUDED_TERMS = [
  "angry", "subway", "candycrush", "plantsvs", "fnaf", "granny", "papas", "papa",
  "bloons", "pvz", "mario", "sm63", "sm64", "geometrydash", "templerun", "jetpackjoyride",
  "cuttherope", "badpiggies", "crossyroad", "fruitninja", "bitlife", "amongus", "flappybird",
  "retrobowl", "cookieclicker", "ducklife", "fireboyandwatergirl", "happywheels", "learntofly",
  "doodlejump", "pacman", "pou", "baldis", "badparenting", "googlebaseball", "googledino",
  "triviacrack", "tombofthemask", "worldshardestgame", "thereisnog", "webecomewhatwebehold",
  "riddleschool", "riddletransfer"
];
const SPECIAL_TITLES = {
  "1v1.lol.html": "1v1.lol",
  "drivemad.htm": "Drive Mad",
  "slope.html": "Slope",
  "polytrack.html": "Polytrack",
  "minesweeper.html": "Minesweeper",
  "wordleunlimited.html": "Wordle Unlimited",
  "spacebarclicker.html": "Spacebar Clicker",
  "idlebreakout.html": "Idle Breakout",
  "bloxorz.html": "Bloxorz",
  "tunnelrush.html": "Tunnel Rush",
  "deathrun3D.html": "Death Run 3D",
  "1on1soccer.html": "1 on 1 Soccer",
  "1on1tennis.html": "1 on 1 Tennis",
  "12minibattles.html": "12 Mini Battles",
  "10minutestilldawn.html": "10 Minutes Till Dawn",
  "8ballclassic.html": "8 Ball Classic",
  "2048cupcakes.html": "2048 Cupcakes"
};

let activeFilter = "all";
let games = [];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function titleFromFile(file) {
  if (SPECIAL_TITLES[file]) return SPECIAL_TITLES[file];
  return file
    .replace(/\.(html|htm)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/(\d+)$/g, " $1")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFromFile(file) {
  const name = normalize(file);
  if (/car|racing|bike|drift|drive|road|traffic|moto|rider|wheelie|parking|flight|plane|rocket/.test(name)) return "racing";
  if (/soccer|football|basket|baseball|tennis|volley|pingpong|golf|boxing|wrestle|archer/.test(name)) return "sports";
  if (/clicker|idle|merge|miner|mart|breakout/.test(name)) return "idle";
  if (/puzzle|2048|word|quiz|bloxorz|minesweeper|chess|stack|trap|sand|draw|state/.test(name)) return "puzzle";
  if (/3d|simulator|slope|tunnel|poly|superhot/.test(name)) return "3d";
  return "arcade";
}

function shouldInclude(file) {
  const name = normalize(file);
  if (!/\.html?$/.test(name)) return false;
  if (name === "1v1.lol.html") return true;
  return !EXCLUDED_TERMS.some((term) => name.includes(term));
}

function formatSize(bytes) {
  if (bytes >= 1000000) return `${Math.round(bytes / 1000000)} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

function renderCards() {
  if (!gamesGrid) return;
  const query = search ? normalize(search.value) : "";
  const visibleGames = games.filter((game) => {
    const haystack = normalize(`${game.title} ${game.file} ${game.category}`);
    const matchesSearch = !query || haystack.includes(query);
    const matchesFilter = activeFilter === "all" || game.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  gamesGrid.innerHTML = visibleGames.map((game) => `
    <a class="game-card pack-card" href="./games/offline/?file=${encodeURIComponent(game.file)}" data-title="${game.title}" data-tags="${game.category} ${game.file}">
      <span class="game-art pack-art ${game.category}-art"><span>${game.title.slice(0, 2).toUpperCase()}</span></span>
      <span class="game-badge ${game.licensed ? "hot" : ""}">${game.licensed ? "Licensed" : game.category}</span>
      <strong>${game.title}</strong>
      <small>${game.licensed ? "Included from your licensed copy." : "Offline HTML game pack entry."}</small>
      <span class="game-meta"><span>${game.category}</span><span>${formatSize(game.size)}</span></span>
    </a>
  `).join("");

  if (emptyState) emptyState.hidden = visibleGames.length !== 0;
  if (libraryStat) libraryStat.textContent = `${visibleGames.length} shown from ${games.length} imported games`;
}

async function loadCatalog() {
  try {
    const response = await fetch(PACK_API);
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    const files = await response.json();
    games = files
      .filter((item) => item.type === "file" && shouldInclude(item.name))
      .map((item) => ({
        title: titleFromFile(item.name),
        file: item.name,
        size: item.size || 0,
        category: categoryFromFile(item.name),
        licensed: normalize(item.name) === "1v1.lol.html"
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
    if (heroCount) heroCount.textContent = `${games.length} games`;
    renderCards();
  } catch (error) {
    if (gamesGrid) gamesGrid.innerHTML = `<div class="loading-card">Could not load the catalog.</div>`;
    if (libraryStat) libraryStat.textContent = "Catalog failed to load";
  }
}

window.addEventListener("load", () => {
  window.setTimeout(() => bootScreen?.classList.add("is-done"), 450);
});
window.setTimeout(() => bootScreen?.classList.add("is-done"), 1600);

if (search) search.addEventListener("input", renderCards);
for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    for (const item of filterButtons) item.classList.toggle("is-active", item === button);
    renderCards();
  });
}

loadCatalog();
