/* ══════════════════ PLACEMENT PHASE ══════════════════ */

// Initialise l'interface de placement et lance l'IA si c'est son tour
function buildPlacementUI() {
  buildPlaceGrid();
  renderPlaceBoard();
  updatePlaceUI();
  if (CFG.mode === 'ai' && placePlayer === 2) setTimeout(aiAutoPlace, 600);
}

// Crée la grille de placement avec coordonnées et cellules cliquables
function buildPlaceGrid() {
  const board_el = document.getElementById('place-board');

  // Style de la grille
  board_el.style.gridTemplateColumns = `repeat(${SIZE},var(--cell))`;
  board_el.style.display = 'grid';
  board_el.style.gap = '2px';
  board_el.style.background = 'rgba(232,88,138,0.1)';
  board_el.style.padding = '3px';
  board_el.style.borderRadius = '14px';
  board_el.style.border = '1.5px solid rgba(232,88,138,0.28)';
  board_el.innerHTML = '';

  // Génère les labels de colonnes (0 à SIZE-1)
  const cc = document.getElementById('place-col-coords');
  cc.innerHTML = '<div style="width:4px"></div>';
  for (let c = 0; c < SIZE; c++) cc.innerHTML += `<div class="coord-lbl">${c}</div>`;

  // Génère les numéros de lignes
  const rn = document.getElementById('place-row-nums');
  rn.innerHTML = '';
  for (let r = 0; r < SIZE; r++) rn.innerHTML += `<div class="row-num">${r}</div>`;

  // Crée chaque cellule et lui associe un clic
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.id = `pc${r}_${c}`;
      el.onclick = () => handlePlaceClick(r, c);
      board_el.appendChild(el);
    }
}

// Met à jour l'affichage de chaque cellule selon l'état du plateau
function renderPlaceBoard() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const el = document.getElementById(`pc${r}_${c}`);
      const d = board[r][c];
      el.className = 'cell';

      // Colorise selon le propriétaire
      if (d.owner === 1) el.classList.add('territory-p1');
      else if (d.owner === 2) el.classList.add('territory-p2');

      if (d.unit) el.classList.add('has-unit');

      // Cellule valide pour placer une unité
      if (!d.unit && d.startZone === placePlayer && placeUnitsLeft[placePlayer].length > 0) {
        el.classList.add('place-valid');
      }
      // Zone de départ adverse (lecture seule)
      else if (d.startZone === 1 && placePlayer !== 1) el.classList.add('start-zone-p1');
      else if (d.startZone === 2 && placePlayer !== 2) el.classList.add('start-zone-p2');

      // Affiche le SVG de l'unité ou vide la cellule
      el.innerHTML = d.unit ? pieceSVG(d.unit, d.player) : '';
    }
}

// Rafraîchit le panneau latéral : nom du joueur, unités restantes, sélecteur
function updatePlaceUI() {
  const left = placeUnitsLeft[placePlayer];
  const pName = placePlayer === 1 ? CFG.p1 : CFG.p2;

  // Affiche le nom et la couleur du joueur actif
  const pEl = document.getElementById('place-player-name');
  pEl.textContent = pName;
  pEl.className = 'pi-player ' + (placePlayer === 1 ? 'p1' : 'p2');
  document.getElementById('place-count').textContent = left.length;

  // Construit les boutons de sélection d'unités (S, C, T)
  const picker = document.getElementById('unit-picker');
  picker.innerHTML = '';
  const counts = { S: 0, C: 0, T: 0 };
  left.forEach(u => counts[u]++);

  ['S', 'C', 'T'].forEach(u => {
    if (counts[u] === 0) return; // Cache les unités épuisées
    const btn = document.createElement('button');
    btn.className = 'upick-btn' + (u === placeUnitType ? ' selected' : '');
    btn.disabled = counts[u] === 0;
    btn.innerHTML = `
      <div class="upick-icon">${pieceSVG(u, placePlayer)}</div>
      <div class="upick-info">
        <div class="upick-name">${UNITS[u].label}</div>
        <div class="upick-count">×${counts[u]} disponible(s)</div>
      </div>`;
    btn.onclick = () => selectPlaceUnit(u);
    picker.appendChild(btn);
  });
}

// Sélectionne le type d'unité à poser et rafraîchit l'UI
function selectPlaceUnit(u) {
  placeUnitType = u;
  updatePlaceUI();
}

// Gère le clic sur une cellule : place l'unité et passe au joueur suivant
function handlePlaceClick(r, c) {
  if (CFG.mode === 'ai' && placePlayer === 2) return; // Bloque le clic humain pendant le tour IA

  const d = board[r][c];
  // Vérifie que la cellule est valide (zone du joueur, vide, unités restantes)
  if (d.startZone !== placePlayer || d.unit || placeUnitsLeft[placePlayer].length === 0) return;

  // Prend l'unité sélectionnée (ou la première disponible par défaut)
  let idx = placeUnitsLeft[placePlayer].indexOf(placeUnitType);
  if (idx === -1) idx = 0;
  const unitType = placeUnitsLeft[placePlayer][idx];

  // Place l'unité sur le plateau et met à jour les listes
  placeUnitsLeft[placePlayer].splice(idx, 1);
  board[r][c].unit = unitType;
  board[r][c].player = placePlayer;
  board[r][c].owner = placePlayer;
  placedUnits[placePlayer].push(unitType);
  addPlaceLog(`${placePlayer === 1 ? CFG.p1 : CFG.p2} place ${UNITS[unitType].label} en (${r},${c})`);

  // Si les deux joueurs n'ont plus d'unités → fin du placement
  if (placeUnitsLeft[placePlayer].length === 0 && placeUnitsLeft[placePlayer === 1 ? 2 : 1].length === 0) {
    finishPlacement();
    return;
  }

  // Passe au joueur suivant (en sautant s'il n'a plus d'unités)
  placePlayer = placePlayer === 1 ? 2 : 1;
  if (placeUnitsLeft[placePlayer].length === 0) placePlayer = placePlayer === 1 ? 2 : 1;
  if (placeUnitsLeft[placePlayer].length > 0) placeUnitType = placeUnitsLeft[placePlayer][0];

  renderPlaceBoard();
  updatePlaceUI();
  if (CFG.mode === 'ai' && placePlayer === 2) setTimeout(aiAutoPlace, 600); // Lance l'IA après 600ms
}

// Ajoute un message horodaté en haut du journal de placement
function addPlaceLog(msg) {
  const el = document.getElementById('place-log');
  const div = document.createElement('div');
  div.style.cssText = 'margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.64rem;color:var(--muted)';
  div.textContent = msg;
  el.prepend(div);
}

// Termine la phase de placement et lance la partie
function finishPlacement() {
  addPlaceLog('Placement terminé ! La bataille commence.');

  // Sauvegarde l'état initial du plateau pour un éventuel replay
  boardSnapshot = board.map(row => row.map(cell => ({ ...cell })));

  // Réinitialise le modal et bascule vers l'écran de jeu
  document.getElementById('modal-content').innerHTML = MODAL_ORIGINAL_HTML;
  showScreen('game-screen');
  buildGameGrid();
  renderBoard();
  updateTurnUI();

  // Configure les boutons de lancer de dés (J1 commence)
  document.getElementById('btn-roll-p1').disabled = false;
  document.getElementById('btn-roll-p2').disabled = true;
  document.getElementById('btn-start').style.display = 'none';
  document.getElementById('roll-p1').textContent = '—';
  document.getElementById('roll-p2').textContent = '—';

  // Affiche les noms des joueurs dans l'interface de dés
  document.getElementById('roll-name-p1').textContent = CFG.p1;
  document.getElementById('roll-name-p2').textContent = CFG.p2;
  document.getElementById('rbtn-name-p1').textContent = CFG.p1;
  document.getElementById('rbtn-name-p2').textContent = CFG.p2;

  startRolls = [0, 0];
  document.getElementById('modal-backdrop').classList.add('show'); // Affiche le modal de lancer
}