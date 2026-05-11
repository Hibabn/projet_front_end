/* ══════════════════ STARTUP ROLLS ══════════════════ */
async function startRoll(player){
  const val=Math.ceil(Math.random()*6);startRolls[player-1]=val;
  playDiceSound();
  if(player===1){
    document.getElementById('roll-p1').textContent=val;
    document.getElementById('btn-roll-p1').disabled=true;
    /* Si mode IA, le joueur 2 lance automatiquement */
    if(CFG.mode==='ai'){
      setTimeout(()=>startRoll(2),600);
    } else {
      document.getElementById('btn-roll-p2').disabled=false;
    }
  } else {
    document.getElementById('roll-p2').textContent=val;document.getElementById('btn-roll-p2').disabled=true;
    const a=startRolls[0],b=startRolls[1];
    if(a===b){
      document.getElementById('roll-p1').textContent='—';document.getElementById('roll-p2').textContent='—';
      startRolls=[0,0];
      document.getElementById('btn-roll-p1').disabled=false;
      if(CFG.mode!=='ai')document.getElementById('btn-roll-p2').disabled=true;
      addLog('Égalité ! Relancez.','warn');
      if(CFG.mode==='ai')setTimeout(()=>startRoll(1),400);
      return;
    }
    currentPlayer=a>b?1:2;const winner=a>b?CFG.p1:CFG.p2;
    setTimeout(()=>{const p=document.createElement('p');p.className='winner-msg';p.style.cssText='color:var(--rose);font-size:1rem;margin:10px 0;font-weight:700;font-family:Cinzel,serif;letter-spacing:0.06em';p.textContent=`⚔ ${winner} commence !`;const mc=document.getElementById('modal-content');const bs=document.getElementById('btn-start');mc.insertBefore(p,bs);bs.style.display='block';},300);
  }
}

function startGame(){
  document.getElementById('modal-backdrop').classList.remove('show');
  addLog(`Partie lancée ! Tour : ${currentPlayer===1?CFG.p1:CFG.p2}`,'turn');
  updateTurnUI();
  if(CFG.mode==='ai'&&currentPlayer===2){
    setTimeout(aiPlayTurn,800);
  } else {
    startTimer();
  }
}