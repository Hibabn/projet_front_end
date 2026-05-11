function doMove(r1,c1,r2,c2){
  const unit=board[r1][c1].unit;
  const color=currentPlayer===1?'#e8588a':'#9b5de5';
  animatePiece(r1,c1,'anim-move',400);
  spawnParticles(getCellCenter(r1,c1).x,getCellCenter(r1,c1).y,color,5,false);
  const wasDefending=board[r1][c1].defending;
  board[r2][c2].unit=unit;board[r2][c2].player=currentPlayer;board[r2][c2].owner=currentPlayer;
  board[r2][c2].defending=false; // moving cancels defend stance
  board[r1][c1].unit=null;board[r1][c1].player=0;board[r1][c1].defending=false;
  flashCell(r2,c2);
  if(board[r2][c2].trap){
    revealCellIfSpecial(r2,c2);
    const dst=getCellCenter(r2,c2);
    spawnParticles(dst.x,dst.y,'#e05050',18,true);
    playTrapSound();
    shakeBoard();spawnKillBanner('💥 PIÈGE !');
    addLog('⚠ PIÈGE déclenché ! Unité détruite.','warn');
    board[r2][c2].unit=null;board[r2][c2].player=0;
    board[r2][c2].trap=false;trapCells.delete(`${r2},${c2}`);revealedCells.delete(`${r2},${c2}`);
  } else if(board[r2][c2].bonus){
    revealCellIfSpecial(r2,c2);
    spawnParticles(getCellCenter(r2,c2).x,getCellCenter(r2,c2).y,'#f4a261',10,false);
    addLog(`✦ Case Bonus activée par ${currentPlayer===1?CFG.p1:CFG.p2} ! (+1 force au prochain combat)`,'capture');
    board[r2][c2].bonus=false;bonusCells.delete(`${r2},${c2}`);revealedCells.delete(`${r2},${c2}`);
    board[r2][c2].bonusBuff=true;
  } else {
    addLog(`✿ Case conquise par ${currentPlayer===1?CFG.p1:CFG.p2}.`,'capture');
  }
  updateMoveUI();
}