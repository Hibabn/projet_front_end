/* ══════════════════ RENDER BOARD + SCORE ══════════════════ */

// Redessine tout le plateau et met à jour les scores
function renderBoard() {
  revealAroundUnits(); // Cache ou montre les cases autour des soldats

  // On prépare des compteurs à zéro pour les deux joueurs
  let s1 = 0, s2 = 0, // cases possédées par chaque joueur
    u1 = 0, u2 = 0, // soldats vivants de chaque joueur
    b1 = 0, b2 = 0; // bonus actifs de chaque joueur
  const alive1 = [], alive2 = []; // Listes des soldats encore en vie

  // On regarde chaque case du plateau une par une
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const el = document.getElementById(`c${r}_${c}`); // On récupère la case dans la page
      const d = board[r][c];                             // Les infos de cette case (unité, propriétaire...)
      const k = `${r},${c}`;                             // Le nom unique de cette case ex: "2,3"
      const isRevealed = revealedCells.has(k);           // Est-ce que le joueur peut voir cette case ?

      el.className = 'cell'; // On efface tous les styles de la case pour repartir à zéro

      // Si la case a un bonus ET qu'on peut la voir → on la colorie en bonus
      if (d.bonus && isRevealed) el.classList.add('bonus');
      // Si la case a un piège ET qu'on peut la voir → on la colorie en piège
      if (d.trap && isRevealed) el.classList.add('trap');

      // Case spéciale mais cachée et sans soldat → effet de brouillard
      if ((d.bonus || d.trap) && !isRevealed && !d.unit) el.classList.add('cell-fog');

      // Si la case appartient au joueur 1 → on la colorie et on ajoute 1 à son score
      if (d.owner === 1) { el.classList.add('territory-p1'); s1++; }
      // Si la case appartient au joueur 2 → pareil pour lui
      else if (d.owner === 2) { el.classList.add('territory-p2'); s2++; }

      if (d.unit) el.classList.add('has-unit');            // Il y a un soldat sur cette case
      if (d.defending) el.classList.add('defending-cell'); // Le soldat sur cette case est en mode défense

      // Si c'est la case que le joueur a cliquée → on la met en surbrillance
      if (selectedCell && selectedCell[0] === r && selectedCell[1] === c)
        el.classList.add('selected');

      // On dessine le soldat sur la case + ⚡ s'il est boosté + 🛡 s'il défend
      el.innerHTML = d.unit
        ? pieceSVG(d.unit, d.player, { buffed: !!d.bonusBuff })
          + (d.bonusBuff ? '<span style="position:absolute;top:1px;left:2px;font-size:9px;z-index:4;text-shadow:0 0 6px gold">⚡</span>' : '')
          + (d.defending ? '<span style="position:absolute;top:1px;right:2px;font-size:9px;z-index:4;text-shadow:0 0 6px #9b5de5">🛡</span>' : '')
        : ''; // Pas de soldat → case vide

      // On ajoute le soldat à la liste du bon joueur et on compte ses bonus
      if (d.player === 1 && d.unit) { u1++; alive1.push(d.unit); if (d.bonus) b1++; }
      if (d.player === 2 && d.unit) { u2++; alive2.push(d.unit); if (d.bonus) b2++; }
    }
  }

  updateScorePanel(s1, s2, u1, u2, b1, b2, alive1, alive2); // On envoie tous les scores au panneau
}

// Met à jour tous les chiffres et barres du panneau de score
function updateScorePanel(s1, s2, u1, u2, b1, b2, alive1, alive2) {
  const TOTAL = SIZE * SIZE;                             // Nombre total de cases sur le plateau
  const k1 = killPoints[1], k2 = killPoints[2];         // Points gagnés en éliminant des soldats
  const tot1 = s1 + k1, tot2 = s2 + k2;                 // Score final = cases + kills

  // On écrit les scores dans la page
  document.getElementById('score-terr-p1').textContent = s1;
  document.getElementById('score-kill-p1').textContent = k1;
  document.getElementById('score-total-p1').textContent = tot1;
  document.getElementById('score-terr-p2').textContent = s2;
  document.getElementById('score-kill-p2').textContent = k2;
  document.getElementById('score-total-p2').textContent = tot2;

  // On calcule le % de cases contrôlées (minimum 2% pour que la barre reste visible)
  const dp1 = Math.max(Math.round((s1 / TOTAL) * 100), 2);
  const dp2 = Math.max(Math.round((s2 / TOTAL) * 100), 2);
  document.getElementById('dom-fill-p1').style.width = dp1 + '%'; // Largeur de la barre joueur 1
  document.getElementById('dom-fill-p2').style.width = dp2 + '%'; // Largeur de la barre joueur 2
  document.getElementById('dom-lbl-p1').textContent = `${CFG.p1} — ${s1} cases · ${k1} pts kill`;
  document.getElementById('dom-lbl-p2').textContent = `${k2} pts kill · ${s2} cases — ${CFG.p2}`;

  // On affiche qui est en tête et combien de cases sont encore libres
  const neutral = TOTAL - s1 - s2; // Cases sans propriétaire
  let lead = s1 > s2 ? `${CFG.p1} mène +${s1 - s2}` : s2 > s1 ? `${CFG.p2} mène +${s2 - s1}` : 'Territoire à égalité';
  document.getElementById('dom-lead').textContent = lead + (neutral > 0 ? ` · ${neutral} libres` : '');

  // On affiche combien de soldats sont encore en vie pour chaque joueur
  const init = initialUnits[1].length; // Nombre de soldats au départ
  document.getElementById('units-p1').textContent = `${u1} / ${init}`;
  document.getElementById('units-p2').textContent = `${u2} / ${init}`;
  document.getElementById('ubar-p1').style.width = Math.round((u1 / init) * 100) + '%'; // Barre de vie joueur 1
  document.getElementById('ubar-p2').style.width = Math.round((u2 / init) * 100) + '%'; // Barre de vie joueur 2

  // On affiche combien de bonus chaque joueur a sur ses soldats
  document.getElementById('bonus-p1').textContent = b1;
  document.getElementById('bonus-p2').textContent = b2;

  // On calcule la progression vers la victoire (bloqué à 100% max)
  const pp1 = Math.min(Math.round((s1 / WIN_GOAL) * 100), 100);
  const pp2 = Math.min(Math.round((s2 / WIN_GOAL) * 100), 100);
  document.getElementById('prog-p1-pct').textContent = pp1 + '%';
  document.getElementById('prog-p2-pct').textContent = pp2 + '%';
  document.getElementById('pbar-p1').style.width = pp1 + '%';
  document.getElementById('pbar-p2').style.width = pp2 + '%';
  document.getElementById('wr-p1').style.width = Math.max(pp1, 2) + '%'; // Min 2% pour rester visible
  document.getElementById('wr-p2').style.width = Math.max(pp2, 2) + '%';
  document.getElementById('wr-n-p1').textContent = s1; // Nombre de cases du joueur 1 dans la barre
  document.getElementById('wr-n-p2').textContent = s2;

  // On dessine les petits pions qui montrent les soldats vivants et morts
  renderPips('pips-p1', 1, initialUnits[1], alive1);
  renderPips('pips-p2', 2, initialUnits[2], alive2);

  // On met en évidence la carte du joueur dont c'est le tour
  document.getElementById('pcard-p1').className = 'pcard p1' + (currentPlayer === 1 ? ' active' : '');
  document.getElementById('pcard-p2').className = 'pcard p2' + (currentPlayer === 2 ? ' active' : '');

  // On change le badge pour montrer qui joue et qui attend
  document.getElementById('badge-p1').className = 'pc-turn-badge' + (currentPlayer === 1 ? ' p1' : ' wait');
  document.getElementById('badge-p1').textContent = currentPlayer === 1 ? '▶ EN JEU' : 'attend…';
  document.getElementById('badge-p2').className = 'pc-turn-badge' + (currentPlayer === 2 ? ' p2' : ' wait');
  document.getElementById('badge-p2').textContent = currentPlayer === 2 ? '▶ EN JEU' : 'attend…';
}

// Dessine les petits pions : colorés si le soldat est vivant, gris s'il est mort
function renderPips(id, player, initial, alive) {
  const el = document.getElementById(id);
  if (!el) return; // Si la zone n'existe pas dans la page, on s'arrête

  // On compte combien de soldats vivants il reste par type (S, C, T)
  const aMap = { S: 0, C: 0, T: 0 };
  alive.forEach(u => { aMap[u] = (aMap[u] || 0) + 1; });

  // On crée un pion HTML pour chaque soldat de départ
  const shown = { S: 0, C: 0, T: 0 }; // Combien on en a déjà dessiné par type
  let html = '';
  initial.forEach(u => {
    const dead = shown[u] >= (aMap[u] || 0); // Ce soldat est mort si on a déjà compté tous les vivants
    const isTank = u === 'T';                 // C'est un tank ? Style différent
    html += `<div class="upip p${player}${isTank ? ' tank' : ''}${dead ? ' dead' : ''}" 
      title="${UNITS[u].label} · Force ${UNITS[u].power} · Kill=${UNITS[u].killPts}pts">
      <div class="utype">${u}</div>
      <div class="uforce">F${UNITS[u].power}·${UNITS[u].killPts}p</div>
    </div>`;
    shown[u] = (shown[u] || 0) + 1; // On note qu'on a dessiné un soldat de ce type
  });
  el.innerHTML = html; // On met tous les pions dans la page
}

// Colorie en vert toutes les cases où le soldat sélectionné peut aller
function showReachable() {
  if (!selectedCell) return;              // Aucun soldat sélectionné → on ne fait rien
  const [sr, sc] = selectedCell;          // La ligne et la colonne du soldat sélectionné
  const moves = getValidMoves(sr, sc, 0); // On calcule toutes les cases où il peut aller

  // Pour chaque case accessible, on ajoute la couleur verte
  for (const { r2, c2 } of moves)
    document.getElementById(`c${r2}_${c2}`).classList.add('reachable');
}