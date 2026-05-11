let aiKnownTraps = new Set();  // cases pièges que l'IA a "vues" (révélées)
let aiKnownBonus = new Set();  // cases bonus que l'IA a "vues"

/* Mettre à jour la mémoire IA selon les cases révélées */
function aiUpdateMemory(){
  for(const k of revealedCells){
    const [r,c] = k.split(',').map(Number);
    if(board[r][c].trap) aiKnownTraps.add(k);
    else aiKnownTraps.delete(k); // piège déclenché, plus dangereux
    if(board[r][c].bonus) aiKnownBonus.add(k);
    else aiKnownBonus.delete(k); // bonus pris
  }
  // Nettoyer les bonus/pièges qui n'existent plus
  for(const k of aiKnownTraps) if(!trapCells.has(k)) aiKnownTraps.delete(k);
  for(const k of aiKnownBonus) if(!bonusCells.has(k)) aiKnownBonus.delete(k);
}

/* --- Trouver le meilleur mouvement selon le niveau --- */