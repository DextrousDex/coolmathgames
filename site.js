const search = document.querySelector("#gameSearch");
const cards = [...document.querySelectorAll(".game-card")];

if (search) {
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    for (const card of cards) {
      card.hidden = !card.textContent.toLowerCase().includes(query);
    }
  });
}
