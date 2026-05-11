/* ══════════════════ STARTUP ROLLS ══════════════════ */

// Fonction asynchrone pour lancer le dé de départ
async function startRoll(player){

  const val = Math.ceil(Math.random()*6); // valeur aléatoire entre 1 et 6
  startRolls[player-1] = val; // stocke le résultat du joueur

  playDiceSound(); 

  // si c'est le joueur 1
  if(player === 1){

    document.getElementById('roll-p1').textContent = val; // affiche valeur joueur 1
    document.getElementById('btn-roll-p1').disabled = true; // désactive bouton joueur 1

    // si mode IA
    if(CFG.mode === 'ai'){
      setTimeout(()=>startRoll(2),600); // IA lance joueur 2 automatiquement
    } else {
      document.getElementById('btn-roll-p2').disabled = false; // active joueur 2
    }

  } else {

    document.getElementById('roll-p2').textContent = val; // affiche valeur joueur 2
    document.getElementById('btn-roll-p2').disabled = true; // désactive bouton joueur 2

    const a = startRolls[0], b = startRolls[1]; // récupère les deux résultats

    // si égalité
    if(a === b){

      document.getElementById('roll-p1').textContent = '—'; // reset joueur 1
      document.getElementById('roll-p2').textContent = '—'; // reset joueur 2

      startRolls = [0,0]; // reset valeurs

      document.getElementById('btn-roll-p1').disabled = false; // réactive joueur 1

      if(CFG.mode !== 'ai')
        document.getElementById('btn-roll-p2').disabled = true; // bloque joueur 2

      addLog('Égalité ! Relancez.','warn'); // message égalité

      if(CFG.mode === 'ai')
        setTimeout(()=>startRoll(1),400); // relance IA

      return; // stop fonction
    }

    // détermine le joueur qui commence
    currentPlayer = a > b ? 1 : 2;

    const winner = a > b ? CFG.p1 : CFG.p2; // nom du gagnant

    // affiche message du gagnant
    setTimeout(()=>{

      const p = document.createElement('p'); // crée un paragraphe

      p.className = 'winner-msg'; // style message

      // style du texte
      p.style.cssText = 'color:var(--rose);font-size:1rem;margin:10px 0;font-weight:700;font-family:Cinzel,serif;letter-spacing:0.06em';

      p.textContent = `⚔ ${winner} commence !`; // texte affiché

      const mc = document.getElementById('modal-content'); // popup contenu
      const bs = document.getElementById('btn-start'); // bouton start

      mc.insertBefore(p, bs); // ajoute message avant bouton
      bs.style.display = 'block'; // affiche bouton start

    },300);
  }
}


/* Fonction pour démarrer la partie */
function startGame(){

  document.getElementById('modal-backdrop').classList.remove('show'); // ferme la popup

  addLog(`Partie lancée ! Tour : ${currentPlayer===1?CFG.p1:CFG.p2}`,'turn'); // log début partie

  updateTurnUI(); // met à jour l'interface du tour

  // si mode IA et joueur 2 commence
  if(CFG.mode === 'ai' && currentPlayer === 2){
    setTimeout(aiPlayTurn,800); // IA joue
  } else {
    startTimer(); // lance le timer du joueur
  }
}