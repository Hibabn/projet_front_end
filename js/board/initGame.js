/* ══════════════════ INIT GAME ══════════════════ */

function getSelectedVal(groupId, fallback) {
  const el = document.querySelector(
    `#${groupId} .opt-btn.selected,
     #${groupId} .opt-btn.sel-v,
     #${groupId} .opt-btn.sel-g`
  );
  return el ? el.dataset.val : fallback;
}

function initGame() {

  /* ── paramètres joueurs ── */
  CFG.p1       = document.getElementById('p1-name').value.trim() || 'Alice';
  CFG.mode     = getSelectedVal('mode-opts',  'pvp');
  CFG.p2       = CFG.mode === 'ai'
                   ? 'Ordinateur'
                   : (document.getElementById('p2-name').value.trim() || 'Bob');
  CFG.aiLevel  = getSelectedVal('ai-opts',   'ai-medium');
  CFG.size     = parseInt(getSelectedVal('map-opts',   '8'));
  CFG.diff     = getSelectedVal('diff-opts', 'easy');
  CFG.timerSec = parseInt(getSelectedVal('timer-opts', '0'));

  /* ── config plateau ── */
  SIZE     = CFG.size;
  WIN_GOAL = Math.floor((SIZE * SIZE) / 2) + 1;

  const dc = DIFF_CONFIG[CFG.diff];

  /* ── reset état global ── */
  const freshUnits = () => ({ 1: [...dc.units], 2: [...dc.units] });

  initialUnits   = freshUnits();
  placeUnitsLeft = freshUnits();
  placedUnits    = { 1: [],  2: []  };
  killPoints     = { 1: 0,   2: 0   };

  [revealedCells, aiKnownTraps, aiKnownBonus] = [new Set(), new Set(), new Set()];

  currentPlayer  = 1;
  placePlayer    = 1;
  placementPhase = true;
  board          = [];

  initBoardData(dc.bonusCount, dc.trapCount);

  /* ── mise à jour UI ── */
  const setText = (id, val) => document.getElementById(id).textContent = val;

  setText('pc-name-p1', CFG.p1);
  setText('pc-name-p2', CFG.p2);
  setText('wr-name-p1', CFG.p1);
  setText('wr-name-p2', CFG.p2);

  setText('av-p1', CFG.p1[0].toUpperCase());
  setText('av-p2', CFG.mode === 'ai' ? '🤖' : CFG.p2[0].toUpperCase());

  setText('wr-title',    `course vers la victoire · ${WIN_GOAL} cases`);
  setText('dom-win-goal', `${WIN_GOAL} cases pour gagner`);

  ['wr-goal', 'wr-goal2'].forEach(id => setText(id, `/ ${WIN_GOAL}`));

  /* ── lancement placement ── */
  buildPlacementUI();
  showScreen('place-screen');
}