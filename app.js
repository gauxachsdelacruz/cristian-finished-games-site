const search = document.querySelector('#search');
const cards = Array.from(document.querySelectorAll('.game-card'));
const boardShell = document.querySelector('.board-shell');
const board = document.querySelector('#board');
const topScrollbar = document.querySelector('.board-scrollbar');
const topScrollbarInner = document.querySelector('.board-scrollbar-inner');
const yearRuler = document.querySelector('.year-ruler');
let isSyncingScroll = false;

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  cards.forEach((card) => {
    const haystack = `${card.dataset.title || ''} ${card.dataset.platform || ''}`;
    const matchesSearch = !query || haystack.includes(query);
    card.classList.toggle('is-hidden', !matchesSearch);
  });
}

function syncScroll(source, target) {
  if (!source || !target || isSyncingScroll) return;
  isSyncingScroll = true;
  target.scrollLeft = source.scrollLeft;
  updateYearRuler();
  requestAnimationFrame(() => {
    isSyncingScroll = false;
  });
}

function updateYearRuler() {
  if (!yearRuler || !boardShell) return;
  yearRuler.style.transform = `translateX(${-boardShell.scrollLeft}px)`;
}

function updateTopScrollbar() {
  if (!board || !boardShell || !topScrollbar || !topScrollbarInner) return;
  topScrollbarInner.style.width = `${board.scrollWidth}px`;
  topScrollbar.hidden = board.scrollWidth <= boardShell.clientWidth;
  updateYearRuler();
}

search?.addEventListener('input', applyFilters);
topScrollbar?.addEventListener('scroll', () => syncScroll(topScrollbar, boardShell));
boardShell?.addEventListener('scroll', () => syncScroll(boardShell, topScrollbar));
boardShell?.addEventListener('scroll', updateYearRuler);
window.addEventListener('resize', updateTopScrollbar);
window.addEventListener('load', updateTopScrollbar);

if ('ResizeObserver' in window && board) {
  new ResizeObserver(updateTopScrollbar).observe(board);
}

updateTopScrollbar();
