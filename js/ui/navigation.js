/* ══════════════════ NAVIGATION ══════════════════ */

// Masque tous les écrans et affiche uniquement celui dont l'id est passé en paramètre
function showScreen(id) {
  ['intro-screen', 'setup-screen', 'rules-screen', 'place-screen', 'game-screen']
    .forEach(s => document.getElementById(s).classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Affiche l'écran d'accueil
function showIntro() {
  showScreen('intro-screen');
}

// Affiche les règles depuis l'intro et remplit les aperçus
function showIntroToRules() {
  showScreen('rules-screen');
  fillRulesPreviews();
}

// Affiche les règles et rafraîchit les aperçus
function showRules() {
  showScreen('rules-screen');
  fillRulesPreviews();
}

// Arrête le timer, ferme le modal et retourne au setup
function showSetup() {
  stopTimer();
  document.getElementById('modal-backdrop').classList.remove('show');
  showScreen('setup-screen');
}

// Désélectionne tous les boutons du groupe, puis sélectionne celui cliqué
function selectOpt(el, groupId, selClass) {
  document.getElementById(groupId)
    .querySelectorAll('.opt-btn')
    .forEach(b => b.classList.remove('selected', 'sel-v', 'sel-g'));
  el.classList.add(selClass);
}