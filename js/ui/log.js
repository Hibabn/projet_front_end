/* ══════════════════ LOG ══════════════════ */

// Ajoute un message en haut du journal de jeu
function addLog(msg, type = 'info') {
  const el = document.getElementById('log');
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;  // type définit la couleur : 'info', 'warn', 'capture'...
  div.textContent = msg;
  el.prepend(div); // Plus récent en haut
}

/* ══════════════════ RULES PREVIEWS ══════════════════ */

// Injecte les SVG des unités dans la page des règles
function fillRulesPreviews() {
  const ids = { S: 'ru-s', C: 'ru-c', T: 'ru-t' }; // Soldat → ru-s, Cavalier → ru-c, Tour → ru-t

  for (const [unit, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = pieceSVG(unit, 1); // Affiche le SVG de l'unité côté J1
  }
}

// Attend 100ms que le DOM soit prêt avant d'afficher les previews
setTimeout(fillRulesPreviews, 100);