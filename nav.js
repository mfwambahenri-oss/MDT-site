(function () {
  var burger    = document.querySelector('.nav-burger');
  var navLinks  = document.querySelector('.nav-links');
  var navParent = document.querySelector('.nav-parent');
  var dropdown  = document.querySelector('.dropdown');

  if (!burger || !navLinks) return;

  /* ── Créer l'overlay une seule fois ── */
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  /* ── Ouvrir / fermer le menu principal ── */
  burger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('nav-open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    overlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) closeDropdown();
  });

  /* ── Cliquer l'overlay ferme le menu ── */
  overlay.addEventListener('click', function () {
    closeMenu();
  });

  /* ── Toggle dropdown sur mobile (tap au lieu du hover) ── */
  if (navParent) {
    navParent.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown) {
          var opened = dropdown.classList.toggle('mobile-open');
          rotateArrow(opened);
        }
      }
    });
  }

  /* ── Fermer le menu quand un sous-lien est cliqué ── */
  navLinks.querySelectorAll('a:not(.nav-parent)').forEach(function (a) {
    a.addEventListener('click', function () {
      closeMenu();
    });
  });

  /* ── Fermer au resize desktop ── */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ── Helpers ── */
  function closeMenu () {
    navLinks.classList.remove('nav-open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    closeDropdown();
  }

  function closeDropdown () {
    if (dropdown) dropdown.classList.remove('mobile-open');
    rotateArrow(false);
  }

  function rotateArrow (open) {
    var arrow = document.querySelector('.nav-parent-arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  }
})();
