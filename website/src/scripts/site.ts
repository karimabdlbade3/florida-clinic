import { initClickTracking } from './track';

// ---- Mobile navigation ----
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (toggle && nav) {
  const label = toggle.querySelector<HTMLElement>('[data-nav-toggle-label]');
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (label) label.textContent = open ? toggle.dataset.labelClose! : toggle.dataset.labelOpen!;
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });
  nav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setOpen(false); });
  window.matchMedia('(min-width: 921px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
}

// ---- Header shadow on scroll ----
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---- Reveal on scroll ----
const items = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // Only animate elements that start below the fold: no flash for visible content.
  items.forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
      el.classList.add('is-pending');
      io.observe(el);
    }
  });
}

initClickTracking();
