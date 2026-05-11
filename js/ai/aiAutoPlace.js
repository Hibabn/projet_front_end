/* ══════════════════ IA ══════════════════ */

/* --- Placement automatique de l'IA --- */
function aiAutoPlace(){
  if(placeUnitsLeft[2].length===0){finishPlacement();return;}
  /* Trouver toutes les cases valides pour le joueur 2 */
  const validCells=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(board[r][c].startZone===2&&!board[r][c].unit)validCells.push([r,c]);
  }
  if(validCells.length===0){finishPlacement();return;}
  /* Choisir la case et l'unité */
  const [r,c]=validCells[Math.floor(Math.random()*validCells.length)];
  const unitType=placeUnitsLeft[2][0];
  placeUnitsLeft[2].shift();
  board[r][c].unit=unitType;board[r][c].player=2;board[r][c].owner=2;
  placedUnits[2].push(unitType);
  addPlaceLog(`🤖 ${CFG.p2} place ${UNITS[unitType].label} en (${r},${c})`);

  /* Tous placés ? */
  if(placeUnitsLeft[1].length===0&&placeUnitsLeft[2].length===0){finishPlacement();return;}

  /* Passer au joueur humain s'il reste des unités */
  placePlayer=1;
  if(placeUnitsLeft[1].length===0){
    placePlayer=2;
    setTimeout(aiAutoPlace,500);
  } else {
    if(placeUnitsLeft[1].length>0)placeUnitType=placeUnitsLeft[1][0];
    renderPlaceBoard();updatePlaceUI();
  }
}

/* --- Tour complet de l'IA --- */