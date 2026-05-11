/* ══════════════════ LOG ══════════════════ */

// Fonction qui ajoute un message dans le journal du jeu

function addLog(msg, type = 'info') { 
  // msg = texte du message
  // type = style (info, warn, capture, etc.)

  const el = document.getElementById('log');   // récupère la zone HTML du log

  const div = document.createElement('div');  // crée une nouvelle ligne (div)

  div.className = `log-entry ${type}`;   // applique une classe CSS selon le type (couleur différente)

  div.textContent = msg;  // met le texte du message dans la div

  el.prepend(div);  // ajoute le message en haut du journal
}


/* ══════════════════ RULES PREVIEWS ══════════════════ */

// Fonction qui affiche les unités dans la page des règles
function fillRulesPreviews() {
  const ids = { 
    S: 'ru-s', // Soldat
    C: 'ru-c', // Cavalier → ru-c
    T: 'ru-t'  // Tour → ru-t
  };

  // boucle sur chaque unité
  for (const [unit, id] of Object.entries(ids)) {

    const el = document.getElementById(id); 
    // récupère l’élément HTML correspondant

    if (el) 
      el.innerHTML = pieceSVG(unit, 1); 
      // injecte le SVG de l’unité (joueur 1)
  }
}

// attend 100ms avant d’exécuter la fonction
// (le temps que le HTML soit complètement chargé)
setTimeout(fillRulesPreviews, 100);