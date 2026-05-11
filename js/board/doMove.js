function doMove(r1,c1,r2,c2){    // fonction qui déplace une unité d’une case à une autre

  const unit = board[r1][c1].unit;  // récupère l’unité qui bouge

  const color = currentPlayer===1 ? '#e8588a' : '#9b5de5';  // couleur du joueur (rose ou violet)

  animatePiece(r1,c1,'anim-move',400);  // animation de déplacement de l’unité

  spawnParticles(
    getCellCenter(r1,c1).x,
    getCellCenter(r1,c1).y,
    color,
    5,
    false
  ); 
  // petites particules sur l’ancienne case

  const wasDefending = board[r1][c1].defending;  // sauvegarde si l’unité était en défense

  // place l’unité sur la nouvelle case
  board[r2][c2].unit = unit;
  board[r2][c2].player = currentPlayer;
  board[r2][c2].owner = currentPlayer;

  board[r2][c2].defending = false;  // déplacement annule la défense

  // vide l’ancienne case
  board[r1][c1].unit = null;
  board[r1][c1].player = 0;
  board[r1][c1].defending = false;

  flashCell(r2,c2);   // effet visuel sur la nouvelle case


  /* ═══════════ CAS PIÈGE ═══════════ */

  if(board[r2][c2].trap){   // si la case est un piège

    revealCellIfSpecial(r2,c2);  // révèle la case

    const dst = getCellCenter(r2,c2);  // centre de la case

    spawnParticles(dst.x,dst.y,'#e05050',18,true);  // explosion rouge

    playTrapSound(); // son de piège

    shakeBoard(); // tremblement du plateau

    spawnKillBanner('💥 PIÈGE !'); // affiche message piège

    addLog('⚠ PIÈGE déclenché ! Unité détruite.','warn');  // log du piège

    // détruit l’unité
    board[r2][c2].unit = null;
    board[r2][c2].player = 0;

    board[r2][c2].trap = false;  // désactive le piège

    trapCells.delete(`${r2},${c2}`);  // retire du set pièges

    revealedCells.delete(`${r2},${c2}`);  // retire de révélés


  /* ═══════════ CAS BONUS ═══════════ */

  } else if(board[r2][c2].bonus){

    revealCellIfSpecial(r2,c2);  // révèle case

    spawnParticles(
      getCellCenter(r2,c2).x,
      getCellCenter(r2,c2).y,
      '#f4a261',
      10,
      false
    );  // particules dorées

    addLog(
      `✦ Case Bonus activée par ${currentPlayer===1?CFG.p1:CFG.p2} ! (+1 force au prochain combat)`,
      'capture'
    ); 

    board[r2][c2].bonus = false;  // retire bonus

    bonusCells.delete(`${r2},${c2}`);  // enlève du set bonus

    revealedCells.delete(`${r2},${c2}`);  // enlève révélation

    board[r2][c2].bonusBuff = true;   // active buff bonus


  /* ═══════════ CAS NORMAL ═══════════ */

  } else {
    addLog(
      `✿ Case conquise par ${currentPlayer===1?CFG.p1:CFG.p2}.`,
      'capture'
    ); 
  }

  updateMoveUI(); 
}