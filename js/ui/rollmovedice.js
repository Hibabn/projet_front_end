async function rollMoveDice(){
  if(diceRolled){addLog('Dé déjà lancé ce tour.','info');return;}
  const val=Math.ceil(Math.random()*6);
  playDiceSound();
  await animateDice(val,'dice-pips');
  movePoints=val;diceRolled=true;
  addLog(`🎲 Dé : ${val} point(s).`,'info');
  updateMoveUI();
}

/* ══════════════════ STARTUP ROLLS ══════════════════ */