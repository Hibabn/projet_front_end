/* ══════════════════ INIT GAME ══════════════════ */

/* Helper : trouve le bouton sélectionné dans un groupe,
   quelle que soit la classe de couleur utilisée (selected / sel-v / sel-g) */
function getSelectedVal(groupId, fallback){
  const el = document.querySelector(
    `#${groupId} .opt-btn.selected,
     #${groupId} .opt-btn.sel-v,
     #${groupId} .opt-btn.sel-g`
  );
  return el ? el.dataset.val : fallback;
}

function initGame(){
  CFG.p1       = document.getElementById('p1-name').value.trim() || 'Alice';
  CFG.mode     = getSelectedVal('mode-opts', 'pvp');
  CFG.p2       = CFG.mode === 'ai'
                   ? 'Ordinateur'
                   : (document.getElementById('p2-name').value.trim() || 'Bob');
  CFG.aiLevel  = getSelectedVal('ai-opts',   'ai-medium');
  CFG.size     = parseInt(getSelectedVal('map-opts',  '8'));
  CFG.diff     = getSelectedVal('diff-opts', 'easy');
  CFG.timerSec = parseInt(getSelectedVal('timer-opts', '0'));

  SIZE     = CFG.size;
  WIN_GOAL = Math.floor((SIZE * SIZE) / 2) + 1;

  const dc = DIFF_CONFIG[CFG.diff];

  initialUnits  = { 1: [...dc.units], 2: [...dc.units] };
  placeUnitsLeft = { 1: [...dc.units], 2: [...dc.units] };
  placedUnits   = { 1: [], 2: [] };
  killPoints    = { 1: 0,  2: 0  };

  revealedCells = new Set();
  aiKnownTraps  = new Set();
  aiKnownBonus  = new Set();

  currentPlayer  = 1;
  placePlayer    = 1;
  placementPhase = true;
  board          = [];

  initBoardData(dc.bonusCount, dc.trapCount);

  /* Mise à jour des noms dans l'UI de jeu */
  document.getElementById('pc-name-p1').textContent = CFG.p1;
  document.getElementById('pc-name-p2').textContent = CFG.p2;
  document.getElementById('av-p1').textContent = CFG.p1[0].toUpperCase();
  document.getElementById('av-p2').textContent = CFG.mode === 'ai' ? '🤖' : CFG.p2[0].toUpperCase();
  document.getElementById('wr-name-p1').textContent = CFG.p1;
  document.getElementById('wr-name-p2').textContent = CFG.p2;
  document.getElementById('wr-title').textContent   = `course vers la victoire · ${WIN_GOAL} cases`;
  document.getElementById('dom-win-goal').textContent = `${WIN_GOAL} cases pour gagner`;
  document.getElementById('wr-goal').textContent    = `/ ${WIN_GOAL}`;
  document.getElementById('wr-goal2').textContent   = `/ ${WIN_GOAL}`;

  /* Lancer l'écran de placement */
  buildPlacementUI();
  showScreen('place-screen');
}