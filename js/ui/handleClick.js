/* ══════════════════ CLICK HANDLERS ══════════════════ */

// Gère le clic sur une cellule du plateau
function handleClick(r, c) {
  if (selectedCell) {
    const [sr, sc] = selectedCell;

    // Clic sur la même cellule → désélectionne
    if (sr === r && sc === c) {
      selectedCell = null;
      renderBoard();
      updateMoveUI();
      return;
    }

    // Clic sur une autre cellule → tente une action (déplacement ou attaque)
    processAction(sr, sc, r, c);

  } else {

    // Aucune cellule sélectionnée → sélectionne l'unité du joueur actif
    if (board[r][c].player === currentPlayer && board[r][c].unit) {
      selectedCell = [r, c];
      renderBoard();
      showReachable(); // Affiche les cases accessibles
      updateMoveUI();
    }
  }
}

// Traite l'action entre la cellule source (r1,c1) et la cellule cible (r2,c2)
function processAction(r1, c1, r2, c2) {
  const unit = board[r1][c1].unit;
  const stats = UNITS[unit];

  // Récupère les mouvements valides depuis la cellule source
  const moves = getValidMoves(r1, c1, 0);

  // Vérifie si la cible fait partie des mouvements autorisés
  const match = moves.find(m => m.r2 === r2 && m.c2 === c2);
  if (!match) {
    addLog(`❌ ${stats.label} : mouvement invalide.`, 'warn');
    selectedCell = null;
    renderBoard();
    return;
  }

  // Cible occupée par un ennemi → combat
  if (board[r2][c2].player !== 0 && board[r2][c2].player !== currentPlayer) {
    doCombat(r1, c1, r2, c2); // Le modal gère l'affichage et la fin du tour

  // Cible vide ou alliée → déplacement simple
  } else {
    doMove(r1, c1, r2, c2);
    selectedCell = null;
    checkWin();    // Vérifie si la partie est terminée
    renderBoard();
    endTurn();
  }
}