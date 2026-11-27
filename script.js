(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');

  if (year) year.textContent = String(new Date().getFullYear());

  const filters = [...document.querySelectorAll('.topic-filter')];
  const cards = [...document.querySelectorAll('.focus-card[data-topic]')];
  const status = document.querySelector('.filter-status');
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.topic !== selected; });
    if (status) status.textContent = selected === 'all' ? 'Showing all 3 topics.' : `Showing ${button.textContent.trim()} topic.`;
  }));

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.sr-only').textContent = 'Open navigation';
      nav.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
      nav.classList.toggle('open', isOpen);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 701px)').matches) closeMenu();
    });
  }
})();
