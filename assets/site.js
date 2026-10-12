document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }),
    );
  }

  // Pestañas (sistemas.html).
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

  // Aparición suave al hacer scroll (sin JS o sin IntersectionObserver todo se ve).
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Pie de la caja de bits del inicio: solo nombra apps y sistemas; con las A y la escalera queda vacío.
  const heroBox = document.getElementById('heroBox');
  const heroName = document.getElementById('heroBoxName');
  if (heroBox && heroName) heroBox.addEventListener('bitbox:change', (e) => { heroName.textContent = e.detail.key.startsWith('app:') ? e.detail.name : ''; });

  // Carrusel de capturas.
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    if (!track) return;
    const scrollAmount = carousel.classList.contains('carousel-shots') ? track.clientWidth * 0.9 : 200;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  });

  // Formulario sin backend: arma el correo y lo abre en el cliente del usuario.
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const d = new FormData(form);
      const body = `${d.get('mensaje')}\n\n— ${d.get('nombre')} (${d.get('correo')})`;
      location.href =
        'mailto:m.delarosa.atik.tech@gmail.com' +
        '?subject=' + encodeURIComponent('Contacto desde atiktechmx.com') +
        '&body=' + encodeURIComponent(body);
    });
  }
});
