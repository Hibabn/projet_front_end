function aiPlayTurn(){
  if(currentPlayer!==2||CFG.mode!=='ai')return;
  addLog('🤖 L\'ordinateur réfléchit…','info');
  const level=CFG.aiLevel;

  setTimeout(()=>{
    const move=aiFindBestMove(0,level);
    if(move){
      const{r1,c1,r2,c2}=move;
      if(board[r2][c2].player!==0&&board[r2][c2].player!==2){
        doCombat(r1,c1,r2,c2,true); // autoClose for AI
        selectedCell=null;
        // endTurn after modal auto-closes (1800ms result + 700ms roll + 500ms die2 + 350ms = ~3400ms total)
        setTimeout(()=>{checkWin();renderBoard();endTurn();},3600);
      } else {
        doMove(r1,c1,r2,c2);
        selectedCell=null;
        checkWin();
        renderBoard();
        setTimeout(()=>{endTurn();},500);
      }
    }
  }, 800);
}

/* ══════════════════ IA AMÉLIORÉE ══════════════════ */

/* --- Mémoire des pièges connus de l'IA --- */