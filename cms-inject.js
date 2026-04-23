/**
 * cms-inject.js — MDT Creative House
 * Charge les données depuis /data/*.json et injecte le contenu dans la page.
 * Format data-cms : "fichier:chemin.dans.json"
 * Types : text (défaut) | list | bio | href
 */
(function () {
  var els = document.querySelectorAll('[data-cms]');
  if (!els.length) return;

  // Regrouper les éléments par fichier de données
  var files = {};
  els.forEach(function (el) {
    var ref   = el.getAttribute('data-cms');       // ex: "event-frames:starter.price"
    var colon = ref.indexOf(':');
    var file  = ref.slice(0, colon);
    var path  = ref.slice(colon + 1);
    var type  = el.getAttribute('data-cms-type') || 'text';
    if (!files[file]) files[file] = [];
    files[file].push({ el: el, path: path, type: type });
  });

  // Charger chaque fichier JSON et injecter le contenu
  Object.keys(files).forEach(function (file) {
    fetch('/data/' + file + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Fichier introuvable : ' + file);
        return r.json();
      })
      .then(function (data) {
        files[file].forEach(function (item) {
          var val = getPath(data, item.path);
          if (val === undefined || val === null) return;

          switch (item.type) {
            case 'text':
              item.el.textContent = val;
              break;

            case 'list':
              // val = tableau de strings → <li> par item
              if (Array.isArray(val)) {
                item.el.innerHTML = val
                  .map(function (v) { return '<li>' + v + '</li>'; })
                  .join('');
              }
              break;

            case 'bio':
              // val = tableau de paragraphes → <p> par item
              if (Array.isArray(val)) {
                item.el.innerHTML = val
                  .map(function (p) { return '<p>' + p + '</p>'; })
                  .join('');
              }
              break;

            case 'href':
              item.el.href = val;
              break;
          }
        });
      })
      .catch(function (err) {
        console.warn('[CMS Inject]', err.message);
      });
  });

  // Utilitaire : accès à un chemin imbriqué (ex: "starter.price")
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o !== null && o !== undefined && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }
})();
