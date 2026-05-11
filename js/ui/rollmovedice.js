/* ══════════════════ ROLL MOVE DICE ══════════════════ */

// Fonction asynchrone pour lancer le dé de déplacement
async function rollMoveDice(){

  if(diceRolled){    // Vérifie si le dé a déjà été lancé ce tour

    addLog('Dé déjà lancé ce tour.','info'); 
    return; // empêche de relancer
  }

  const val = Math.ceil(Math.random()*6);     // Génère une valeur aléatoire entre 1 et 6

  playDiceSound();    // Joue le son du dé

  await animateDice(val,'dice-pips');    // Lance l’animation 

  movePoints = val;     // Stocke le nombre de points de déplacement

  diceRolled = true;    // Marque le dé comme déjà lancé

  addLog(`🎲 Dé : ${val} point(s).`,'info');    // Affiche le résultat dans le journal de jeu

  updateMoveUI();    // Met à jour l’interface (boutons, affichage, etc.)
}

/* ══════════════════ STARTUP ROLLS ══════════════════ */