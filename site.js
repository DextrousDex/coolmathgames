const bootScreen = document.querySelector("#bootScreen");
const search = document.querySelector("#gameSearch");
const gamesGrid = document.querySelector("#gamesGrid");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const emptyState = document.querySelector("#emptyState");
const libraryStat = document.querySelector("#libraryStat");
const heroCount = document.querySelector("#heroCount");

const games = [
  {
    title: "1v1.lol",
    file: "1v1.lol.html",
    size: 0,
    category: "shooter",
    badge: "Only game",
    description: "Fast builder shooter, ready to play right now."
  }
];

let activeFilter = "all";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function formatSize(bytes) {
  if (!bytes) return "Instant play";
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
      <span class="game-art pack-art shooter-art"><span>1V1</span></span>
      <span class="game-badge hot">${game.badge}</span>
      <strong>${game.title}</strong>
      <small>${game.description}</small>
      <span class="game-meta"><span>${game.category}</span><span>${formatSize(game.size)}</span></span>
    </a>
  `).join("");

  if (emptyState) emptyState.hidden = visibleGames.length !== 0;
  if (libraryStat) libraryStat.textContent = visibleGames.length === 1 ? "1 game available" : `${visibleGames.length} games available`;
}

function loadCatalog() {
  if (heroCount) heroCount.textContent = "1 game";
  renderCards();
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
