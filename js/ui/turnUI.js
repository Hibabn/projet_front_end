/* ══════════════════ UI UPDATES ══════════════════ */

// Met à jour l'interface du déplacement et des boutons
function updateMoveUI(){

  const btn = document.getElementById('btn-end'); // bouton fin de tour
  const warn = document.getElementById('move-warning'); // message d'alerte déplacement
  const defendBtn = document.getElementById('btn-defend'); // bouton défendre

  // si le bouton défense existe
  if(defendBtn){

    // vérifie si une case est sélectionnée et appartient au joueur actuel
    const hasSelection =
      selectedCell &&
      board[selectedCell[0]][selectedCell[1]].player === currentPlayer;

    defendBtn.disabled = !hasSelection; // active/désactive bouton défense

    // si la case est déjà en défense
    if(hasSelection && board[selectedCell[0]][selectedCell[1]].defending){
      defendBtn.textContent = '🛡 Annuler défense'; // texte bouton
      defendBtn.classList.add('defending-active'); // style actif
    } else {
      defendBtn.textContent = '🛡 Défendre'; // texte normal
      defendBtn.classList.remove('defending-active'); // retire style
    }
  }

  btn.disabled = false; // active bouton fin de tour
  warn.textContent = ''; // enlève message d'avertissement
}


/* Vérifie s'il existe au moins un mouvement possible */
function hasPossibleMove(){

  // boucle sur toutes les lignes du plateau
  for(let r = 0; r < SIZE; r++)

    // boucle sur toutes les colonnes
    for(let c = 0; c < SIZE; c++){

      // si la case n'appartient pas au joueur ou est vide
      if(board[r][c].player !== currentPlayer || !board[r][c].unit)
        continue; // passe à la case suivante

      // vérifie si des déplacements sont possibles
      if(getValidMoves(r,c,0).length > 0)
        return true; // au moins un mouvement existe
    }

  return false; // aucun mouvement possible
}


/* Met à jour l'affichage du tour */
function updateTurnUI(){

  const name = currentPlayer === 1 ? CFG.p1 : CFG.p2; // nom du joueur
  const cls = currentPlayer === 1 ? 'p1' : 'p2'; // classe CSS

  const badge = document.getElementById('turn-badge'); // badge du tour

  badge.textContent = `Tour de ${name}`; // texte affiché
  badge.className = `turn-badge ${cls}`; // style selon joueur
}


/* Termine le tour */
function endTurn(){

  stopTimer(); // arrête le timer

  const prevPlayer = currentPlayer; // sauvegarde joueur précédent

  // enlève l'état défense de toutes les unités du joueur précédent
  for(let r = 0; r < SIZE; r++)
    for(let c = 0; c < SIZE; c++){
      if(board[r][c].player === prevPlayer)
        board[r][c].defending = false;
    }

  currentPlayer = currentPlayer === 1 ? 2 : 1; // change de joueur
  movePoints = 0; // reset points de mouvement
  diceRolled = false; // permet de relancer le dé
  selectedCell = null; // désélectionne case

  const defendBtn = document.getElementById('btn-defend');

  // reset bouton défense
  if(defendBtn){
    defendBtn.disabled = true;
    defendBtn.textContent = '🛡 Défendre';
    defendBtn.classList.remove('defending-active');
  }

  document.getElementById('move-warning').textContent = ''; // supprime warning

  reshuffleSpecials(); // remet les cases spéciales

  addLog(`─── Tour de ${currentPlayer===1?CFG.p1:CFG.p2} ───`,'turn'); // log tour

  updateTurnUI(); // met à jour UI du tour
  renderBoard(); // redraw du plateau

  // si mode IA et c'est au joueur 2
  if(CFG.mode === 'ai' && currentPlayer === 2){
    setTimeout(aiPlayTurn,600); // IA joue
  } else {
    startTimer(); // relance timer humain
  }
}