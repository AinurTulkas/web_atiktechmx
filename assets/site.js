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

  // Carrusel de capturas (suite.html y sistemas.html, hasta migrarlas al diseño nuevo).
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    if (!track) return;
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -200, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: 200, behavior: 'smooth' }));
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
