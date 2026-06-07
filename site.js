const bootScreen = document.querySelector("#bootScreen");
const search = document.querySelector("#gameSearch");
const cards = [...document.querySelectorAll(".game-card")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const emptyState = document.querySelector("#emptyState");

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function updateLibrary() {
  const query = search ? normalize(search.value) : "";
  let shown = 0;

  for (const card of cards) {
    const text = normalize(`${card.dataset.title || ""} ${card.dataset.tags || ""} ${card.textContent}`);
    const matchesSearch = !query || text.includes(query);
    const matchesFilter = activeFilter === "all" || text.includes(activeFilter);
    const visible = matchesSearch && matchesFilter;

    card.hidden = !visible;
    if (visible) shown += 1;
  }

  if (emptyState) emptyState.hidden = shown !== 0;
}

window.addEventListener("load", () => {
  window.setTimeout(() => bootScreen?.classList.add("is-done"), 450);
});

window.setTimeout(() => bootScreen?.classList.add("is-done"), 1600);

if (search) {
  search.addEventListener("input", updateLibrary);
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    for (const item of filterButtons) item.classList.toggle("is-active", item === button);
    updateLibrary();
  });
}

updateLibrary();
