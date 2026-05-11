/* ══════════════════ DEFEND ACTION (Cette unité est maintenant en mode défense ou pas ) ══════════════════ */
function activateDefend(){
  if(!selectedCell){addLog("Sélectionnez d'abord une unité à mettre en défense.",'warn');return;}

  const[r,c]=selectedCell;       // Récupérer les coordonnées

  if(board[r][c].player!==currentPlayer){addLog("Ce n'est pas votre unité !",'warn');return;}  //Vérifier que l’unité appartient au joueur actuel

  if(board[r][c].defending){     //Vérifier si l’unité est déjà en défense


    //CAS 1 → Désactiver la défense
    board[r][c].defending=false;    
    addLog(`🛡 ${UNITS[board[r][c].unit].label} en (${r},${c}) quitte le mode défense.`,'info');
  } else {

    // CAS 2 → Activer la défense
    board[r][c].defending=true;
    movePoints=0;   //ne peut plus bouger pendant ce tour

    addLog(`🛡 ${UNITS[board[r][c].unit].label} en (${r},${c}) est en DÉFENSE ! (+2 contre attaques ennemies ce tour)`,'capture');
  }
  selectedCell=null;
  updateMoveUI();
  renderBoard();
}

/* ══════════════════ WIN CHECK ══════════════════ */