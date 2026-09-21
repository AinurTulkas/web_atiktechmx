document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('.tab-switch').forEach(switcher => {
    const btns = switcher.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
      const name = btn.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
      history.replaceState(null, '', '#' + name);
    }));
  });
  const tabFromHash = document.querySelector('.tab-btn[data-tab="' + location.hash.slice(1) + '"]');
  if (tabFromHash) tabFromHash.click();

  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    if (!track) return;
    const scrollAmount = 200;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  });
});
