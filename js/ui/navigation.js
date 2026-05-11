/* ══════════════════ NAVIGATION ══════════════════ */

// Masque tous les écrans et affiche uniquement celui dont l'id est passé en paramètre
function showScreen(id) {
  // Liste tous les IDs d'écrans et retire la classe 'active' de chacun (les cache tous)
  ['intro-screen', 'setup-screen', 'rules-screen', 'place-screen', 'game-screen']
    .forEach(s => document.getElementById(s).classList.remove('active'));
  // Ajoute la classe 'active' uniquement à l'écran ciblé par l'id (l'affiche)
  document.getElementById(id).classList.add('active');
}

// Affiche l'écran d'accueil
function showIntro() {
  // Appelle showScreen avec l'id de l'écran d'intro pour l'afficher
  showScreen('intro-screen');
}

// Affiche les règles depuis l'intro et remplit les aperçus
function showIntroToRules() {
  // Bascule vers l'écran des règles
  showScreen('rules-screen');
  // Remplit les aperçus affichés dans les règles
  fillRulesPreviews();
}

// Affiche les règles et rafraîchit les aperçus
function showRules() {
  // Bascule vers l'écran des règles
  showScreen('rules-screen');
  // Rafraîchit les aperçus pour refléter les paramètres actuels
  fillRulesPreviews();
}

// Arrête le timer, ferme le modal et retourne au setup
function showSetup() {
  stopTimer();
  // Retire la classe 'show' du fond du modal pour le masquer
  document.getElementById('modal-backdrop').classList.remove('show');
  showScreen('setup-screen');
}

// Désélectionne tous les boutons du groupe, puis sélectionne celui cliqué
function selectOpt(el, groupId, selClass) {
  // Récupère le conteneur du groupe par son ID, puis sélectionne tous les boutons .opt-btn qu'il contient
  document.getElementById(groupId)
    .querySelectorAll('.opt-btn')
    // Retire les classes de sélection ('selected', 'sel-v', 'sel-g') de chaque bouton du groupe
    .forEach(b => b.classList.remove('selected', 'sel-v', 'sel-g'));
  // Ajoute la classe de sélection passée en paramètre au bouton cliqué pour le marquer comme actif
  el.classList.add(selClass);
}