/* fonction principale du tour de l’IA */

function aiPlayTurn(){

  // si ce n’est pas le tour de l’IA ou mode pas IA → on arrête
  if(currentPlayer !== 2 || CFG.mode !== 'ai') return;

  addLog('🤖 L\'ordinateur réfléchit…','info');
  // message dans le journal

  const level = CFG.aiLevel; // récupère le niveau de difficulté de l’IA


  /* petit délai pour simuler la réflexion */
  setTimeout(()=>{

    const move = aiFindBestMove(0, level);  // l’IA choisit son meilleur coup

    if(move){
      const {r1, c1, r2, c2} = move; // extraction des coordonnées du mouvement

      /* si la case contient un ennemi → combat */
      if(board[r2][c2].player !== 0 && board[r2][c2].player !== 2){

        doCombat(r1, c1, r2, c2, true); 

        selectedCell = null;

        // attend la fin de l’animation du combat avant de finir le tour
        setTimeout(()=>{
          checkWin();
          renderBoard();
          endTurn();
        }, 3600);
      }

      /* sinon → simple déplacement */
      else {

        doMove(r1, c1, r2, c2);
        // déplace l’unité

        selectedCell = null;

        checkWin();
        renderBoard();

        // petit délai pour fluidité
        setTimeout(()=>{
          endTurn();
        }, 500);
      }
    }

  }, 800);
  // délai pour simuler “réflexion IA”
}
