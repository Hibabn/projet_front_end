/* --- Placement automatique de l'IA --- */

function aiAutoPlace(){

  if(placeUnitsLeft[2].length === 0){ // si l’IA n’a plus d’unités à placer
    finishPlacement();
    return;
  }

  /* cherche toutes les cases possibles pour l’IA */
  const validCells = [];

  for(let r=0; r<SIZE; r++)
    for(let c=0; c<SIZE; c++){

      if(
        board[r][c].startZone === 2 && // zone joueur 2
        !board[r][c].unit              // case vide
      ){
        validCells.push([r,c]); // ajoute case possible
      }
    }

  if(validCells.length === 0){ // si aucune case disponible
    finishPlacement();
    return;
  }


  /* choix aléatoire d’une case */
  const [r,c] = validCells[Math.floor(Math.random()*validCells.length)];   

  const unitType = placeUnitsLeft[2][0]; // prend la première unité de l’IA

  placeUnitsLeft[2].shift(); // enlève cette unité de la liste

  // place l’unité sur la grille
  board[r][c].unit = unitType;
  board[r][c].player = 2;
  board[r][c].owner = 2;

  placedUnits[2].push(unitType);  // enregistre unité placée

  addPlaceLog(
    `🤖 ${CFG.p2} place ${UNITS[unitType].label} en (${r},${c})`
  );

  /* vérifie si tout le monde a terminé */
  if(
    placeUnitsLeft[1].length === 0 &&
    placeUnitsLeft[2].length === 0
  ){
    finishPlacement();
    return;
  }


  placePlayer = 1;     /* changement de joueur */

  if(placeUnitsLeft[1].length === 0){    // si joueur humain a fini

    placePlayer = 2;

    setTimeout(aiAutoPlace, 500); // IA continue automatiquement
  } 
  else {   // sinon joueur humain joue

    if(placeUnitsLeft[1].length > 0)
      placeUnitType = placeUnitsLeft[1][0];

    renderPlaceBoard(); // mise à jour plateau
    updatePlaceUI();    // mise à jour interface
  }
}

