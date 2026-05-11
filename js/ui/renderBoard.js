/* ══════════════════ RENDER BOARD + SCORE ══════════════════ */

// Redessine tout le plateau et met à jour les scores
function renderBoard() {
  revealAroundUnits(); // Révèle les cellules autour des unités (brouillard de guerre)

  // Compteurs : territoires, unités vivantes, bonus par joueur
  let s1 = 0, s2 = 0, u1 = 0, u2 = 0, b1 = 0, b2 = 0;
  const alive1 = [], alive2 = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const el = document.getElementById(`c${r}_${c}`);
      const d = board[r][c];
      const k = `${r},${c}`;
      const isRevealed = revealedCells.has(k); // Cellule visible ou dans le brouillard

      el.className = 'cell';

      // Bonus/piège visibles uniquement si la cellule est révélée
      if (d.bonus && isRevealed) el.classList.add('bonus');
      if (d.trap && isRevealed) el.classList.add('trap');

      // Cellule spéciale non révélée → effet shimmer (brouillard)
      if ((d.bonus || d.trap) && !isRevealed && !d.unit) el.classList.add('cell-fog');

      // Colorise selon le propriétaire et incrémente les scores de territoire
      if (d.owner === 1) { el.classList.add('territory-p1'); s1++; }
      else if (d.owner === 2) { el.classList.add('territory-p2'); s2++; }

      if (d.unit) el.classList.add('has-unit');
      if (d.defending) el.classList.add('defending-cell');

      // Surbrillance de la cellule sélectionnée
      if (selectedCell && selectedCell[0] === r && selectedCell[1] === c)
        el.classList.add('selected');

      // Affiche le SVG de l'unité + icône ⚡ si boostée + icône 🛡 si en défense
      el.innerHTML = d.unit
        ? pieceSVG(d.unit, d.player, { buffed: !!d.bonusBuff })
          + (d.bonusBuff ? '<span style="position:absolute;top:1px;left:2px;font-size:9px;z-index:4;text-shadow:0 0 6px gold">⚡</span>' : '')
          + (d.defending ? '<span style="position:absolute;top:1px;right:2px;font-size:9px;z-index:4;text-shadow:0 0 6px #9b5de5">🛡</span>' : '')
        : '';

      // Compte les unités vivantes et les bonus actifs par joueur
      if (d.player === 1 && d.unit) { u1++; alive1.push(d.unit); if (d.bonus) b1++; }
      if (d.player === 2 && d.unit) { u2++; alive2.push(d.unit); if (d.bonus) b2++; }
    }
  }

  updateScorePanel(s1, s2, u1, u2, b1, b2, alive1, alive2);
}

// Met à jour tous les éléments du panneau de score
function updateScorePanel(s1, s2, u1, u2, b1, b2, alive1, alive2) {
  const TOTAL = SIZE * SIZE;
  const k1 = killPoints[1], k2 = killPoints[2];
  const tot1 = s1 + k1, tot2 = s2 + k2;

  // Scores : territoire + kills + total
  document.getElementById('score-terr-p1').textContent = s1;
  document.getElementById('score-kill-p1').textContent = k1;
  document.getElementById('score-total-p1').textContent = tot1;
  document.getElementById('score-terr-p2').textContent = s2;
  document.getElementById('score-kill-p2').textContent = k2;
  document.getElementById('score-total-p2').textContent = tot2;

  // Barres de domination (% du plateau contrôlé, minimum 2%)
  const dp1 = Math.max(Math.round((s1 / TOTAL) * 100), 2);
  const dp2 = Math.max(Math.round((s2 / TOTAL) * 100), 2);
  document.getElementById('dom-fill-p1').style.width = dp1 + '%';
  document.getElementById('dom-fill-p2').style.width = dp2 + '%';
  document.getElementById('dom-lbl-p1').textContent = `${CFG.p1} — ${s1} cases · ${k1} pts kill`;
  document.getElementById('dom-lbl-p2').textContent = `${k2} pts kill · ${s2} cases — ${CFG.p2}`;

  // Affiche qui mène et combien de cases sont neutres
  const neutral = TOTAL - s1 - s2;
  let lead = s1 > s2 ? `${CFG.p1} mène +${s1 - s2}` : s2 > s1 ? `${CFG.p2} mène +${s2 - s1}` : 'Territoire à égalité';
  document.getElementById('dom-lead').textContent = lead + (neutral > 0 ? ` · ${neutral} libres` : '');

  // Barres d'unités vivantes (sur le total initial)
  const init = initialUnits[1].length;
  document.getElementById('units-p1').textContent = `${u1} / ${init}`;
  document.getElementById('units-p2').textContent = `${u2} / ${init}`;
  document.getElementById('ubar-p1').style.width = Math.round((u1 / init) * 100) + '%';
  document.getElementById('ubar-p2').style.width = Math.round((u2 / init) * 100) + '%';

  // Nombre de bonus actifs sur les unités
  document.getElementById('bonus-p1').textContent = b1;
  document.getElementById('bonus-p2').textContent = b2;

  // Barres de progression vers l'objectif de victoire (WIN_GOAL cases)
  const pp1 = Math.min(Math.round((s1 / WIN_GOAL) * 100), 100);
  const pp2 = Math.min(Math.round((s2 / WIN_GOAL) * 100), 100);
  document.getElementById('prog-p1-pct').textContent = pp1 + '%';
  document.getElementById('prog-p2-pct').textContent = pp2 + '%';
  document.getElementById('pbar-p1').style.width = pp1 + '%';
  document.getElementById('pbar-p2').style.width = pp2 + '%';
  document.getElementById('wr-p1').style.width = Math.max(pp1, 2) + '%';
  document.getElementById('wr-p2').style.width = Math.max(pp2, 2) + '%';
  document.getElementById('wr-n-p1').textContent = s1;
  document.getElementById('wr-n-p2').textContent = s2;

  // Affiche les pions des unités (vivantes/mortes)
  renderPips('pips-p1', 1, initialUnits[1], alive1);
  renderPips('pips-p2', 2, initialUnits[2], alive2);

  // Badge "EN JEU / attend…" selon le joueur actif
  document.getElementById('pcard-p1').className = 'pcard p1' + (currentPlayer === 1 ? ' active' : '');
  document.getElementById('pcard-p2').className = 'pcard p2' + (currentPlayer === 2 ? ' active' : '');
  document.getElementById('badge-p1').className = 'pc-turn-badge' + (currentPlayer === 1 ? ' p1' : ' wait');
  document.getElementById('badge-p1').textContent = currentPlayer === 1 ? '▶ EN JEU' : 'attend…';
  document.getElementById('badge-p2').className = 'pc-turn-badge' + (currentPlayer === 2 ? ' p2' : ' wait');
  document.getElementById('badge-p2').textContent = currentPlayer === 2 ? '▶ EN JEU' : 'attend…';
}

// Affiche les pions des unités : vivantes en couleur, mortes grisées
function renderPips(id, player, initial, alive) {
  const el = document.getElementById(id);
  if (!el) return;

  // Compte les unités encore en vie par type
  const aMap = { S: 0, C: 0, T: 0 };
  alive.forEach(u => { aMap[u] = (aMap[u] || 0) + 1; });

  // Génère un pion HTML par unité initiale (mort si plus dans alive)
  const shown = { S: 0, C: 0, T: 0 };
  let html = '';
  initial.forEach(u => {
    const dead = shown[u] >= (aMap[u] || 0); // Unité morte si déjà toutes comptées
    const isTank = u === 'T';
    html += `<div class="upip p${player}${isTank ? ' tank' : ''}${dead ? ' dead' : ''}" 
      title="${UNITS[u].label} · Force ${UNITS[u].power} · Kill=${UNITS[u].killPts}pts">
      <div class="utype">${u}</div>
      <div class="uforce">F${UNITS[u].power}·${UNITS[u].killPts}p</div>
    </div>`;
    shown[u] = (shown[u] || 0) + 1;
  });
  el.innerHTML = html;
}

// Surligne en vert les cellules accessibles depuis l'unité sélectionnée
function showReachable() {
  if (!selectedCell) return;
  const [sr, sc] = selectedCell;
  const moves = getValidMoves(sr, sc, 0);

  // Ajoute la classe 'reachable' sur chaque cellule atteignable
  for (const { r2, c2 } of moves)
    document.getElementById(`c${r2}_${c2}`).classList.add('reachable');
}