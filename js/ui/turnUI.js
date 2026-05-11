/* ══════════════════ UI UPDATES ══════════════════ */
function updateMoveUI(){
  const btn=document.getElementById('btn-end'),warn=document.getElementById('move-warning');
  const defendBtn=document.getElementById('btn-defend');
  if(defendBtn){
    const hasSelection=selectedCell&&board[selectedCell[0]][selectedCell[1]].player===currentPlayer;
    defendBtn.disabled=!hasSelection;
    if(hasSelection&&board[selectedCell[0]][selectedCell[1]].defending){
      defendBtn.textContent='🛡 Annuler défense';defendBtn.classList.add('defending-active');
    } else {
      defendBtn.textContent='🛡 Défendre';defendBtn.classList.remove('defending-active');
    }
  }
  btn.disabled=false;warn.textContent='';
}

function hasPossibleMove(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(board[r][c].player!==currentPlayer||!board[r][c].unit)continue;
    if(getValidMoves(r,c,0).length>0)return true;
  }
  return false;
}

function updateTurnUI(){
  const name=currentPlayer===1?CFG.p1:CFG.p2,cls=currentPlayer===1?'p1':'p2';
  const badge=document.getElementById('turn-badge');
  badge.textContent=`Tour de ${name}`;badge.className=`turn-badge ${cls}`;
}

function endTurn(){
  stopTimer();
  // Clear defending state of the player whose turn just ended
  const prevPlayer = currentPlayer;
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(board[r][c].player===prevPlayer) board[r][c].defending=false;
  }
  currentPlayer=currentPlayer===1?2:1;movePoints=0;diceRolled=false;selectedCell=null;
  const defendBtn=document.getElementById('btn-defend');
  if(defendBtn){defendBtn.disabled=true;defendBtn.textContent='🛡 Défendre';defendBtn.classList.remove('defending-active');}
  document.getElementById('move-warning').textContent='';
  reshuffleSpecials();
  addLog(`─── Tour de ${currentPlayer===1?CFG.p1:CFG.p2} ───`,'turn');
  updateTurnUI();renderBoard();
  if(CFG.mode==='ai'&&currentPlayer===2){
    setTimeout(aiPlayTurn,600);
  } else {
    startTimer();
  }
}