/* ══════════════════ CHECK WIN ══════════════════ */

// Vérifie si un joueur a gagné
function checkWin(){

  let s1 = 0, s2 = 0; // nombre de cases contrôlées
  let u1 = 0, u2 = 0; // nombre d’unités restantes

  // parcours tout le plateau
  for(let r = 0; r < SIZE; r++)
    for(let c = 0; c < SIZE; c++){

      // compte les cases possédées
      if(board[r][c].owner === 1) s1++;
      if(board[r][c].owner === 2) s2++;

      // compte les unités restantes
      if(board[r][c].player === 1 && board[r][c].unit) u1++;
      if(board[r][c].player === 2 && board[r][c].unit) u2++;
    }

  // condition victoire joueur 1
  if(s1 >= WIN_GOAL || u2 === 0)
    showWin(CFG.p1, s1, s2);

  // condition victoire joueur 2
  else if(s2 >= WIN_GOAL || u1 === 0)
    showWin(CFG.p2, s1, s2);
}


/* ══════════════════ SHOW WIN ══════════════════ */

// Affiche l’écran de victoire
function showWin(name, s1, s2){

  stopTimer(); // arrête le timer

  const k1 = killPoints[1]; // kills joueur 1
  const k2 = killPoints[2]; // kills joueur 2

  const dc = DIFF_CONFIG[CFG.diff]; // config difficulté

  const diffName = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile'
  }[CFG.diff]; // nom lisible de la difficulté

  // remplace le contenu du modal (popup victoire)
  document.getElementById('modal-content').innerHTML = `

    <div class="win-crown">⚔</div> <!-- icône victoire -->

    <div class="win-name">${name} gagne !</div> <!-- nom gagnant -->

    <p style="font-size:0.75rem;color:var(--dim);margin-bottom:6px">
      Grille ${SIZE}×${SIZE} · ${diffName}
      <span class="diff-badge ${CFG.diff}">${diffName}</span>
    </p>

    <p style="margin:8px 0 3px;color:var(--muted);font-size:0.82rem">
      Scores finaux
    </p>

    <!-- score joueur 1 -->
    <p style="margin:3px 0;font-size:0.8rem;color:var(--rose);font-weight:700">
      ${CFG.p1} : ${s1} cases + ${k1} kill pts = <strong>${s1 + k1}</strong>
    </p>

    <!-- score joueur 2 -->
    <p style="margin:3px 0 20px;font-size:0.8rem;color:var(--violet);font-weight:700">
      ${CFG.p2} : ${s2} cases + ${k2} kill pts = <strong>${s2 + k2}</strong>
    </p>

    <!-- bouton nouvelle config -->
    <button class="btn-modal" onclick="showSetup()" style="margin-bottom:8px">
      ⚙ Nouvelle config
    </button>

    <!-- bouton rejouer -->
    <button class="btn-modal"
      style="background:linear-gradient(135deg,var(--violet),var(--violet-deep));
      box-shadow:0 6px 24px rgba(155,93,229,0.4)"
      onclick="replayGame()">
      ↺ Rejouer même config
    </button>
  `;

  // affiche la popup de victoire
  document.getElementById('modal-backdrop').classList.add('show');
}


/* ══════════════════ REPLAY GAME ══════════════════ */

// Relance une partie avec le même setup
function replayGame(){

  document.getElementById('modal-backdrop').classList.remove('show'); // ferme popup

  // si pas de sauvegarde → nouvelle partie
  if(!boardSnapshot){
    initGame();
    return;
  }

  /* restaure le plateau sauvegardé */
  board = boardSnapshot.map(row =>
    row.map(cell => ({...cell})) // copie profonde
  );

  killPoints = { 1:0, 2:0 }; // reset kills
  revealedCells = new Set(); // reset cases révélées

  /* reset des cases spéciales */
  bonusCells = new Set();
  trapCells = new Set();

  // re-parcourt le plateau
  for(let r = 0; r < SIZE; r++)
    for(let c = 0; c < SIZE; c++){

      // remet les bonus
      if(board[r][c].bonus)
        bonusCells.add(`${r},${c}`);

      // remet les pièges
      if(board[r][c].trap)
        trapCells.add(`${r},${c}`);

      board[r][c].bonusBuff = false; // reset bonus
      board[r][c].defending = false; // reset défense
    }

  currentPlayer = 1; // joueur 1 commence
  movePoints = 0; // reset déplacement
  diceRolled = false; // reset dé
  selectedCell = null; // aucune sélection

  placementPhase = false; // phase de jeu normale

  showScreen('game-screen'); // affiche écran jeu

  buildGameGrid(); // reconstruit grille
  renderBoard(); // affiche plateau
  updateTurnUI(); // met à jour tour

  /* reset modal du dé */
  document.getElementById('modal-content').innerHTML = MODAL_ORIGINAL_HTML;

  document.getElementById('btn-roll-p1').disabled = false; // joueur 1 actif
  document.getElementById('btn-roll-p2').disabled = true; // joueur 2 bloqué

  document.getElementById('btn-start').style.display = 'none'; // cache start

  // reset affichage dé
  document.getElementById('roll-p1').textContent = '—';
  document.getElementById('roll-p2').textContent = '—';

  // reset noms joueurs
  document.getElementById('roll-name-p1').textContent = CFG.p1;
  document.getElementById('roll-name-p2').textContent = CFG.p2;
  document.getElementById('rbtn-name-p1').textContent = CFG.p1;
  document.getElementById('rbtn-name-p2').textContent = CFG.p2;

  startRolls = [0,0]; // reset résultats dé

  document.getElementById('modal-backdrop').classList.add('show'); // réouvre popup

  addLog('↺ Rejouer avec le même placement !','turn'); // log
}