function aiGetAllMoves(player,pts){
  const moves=[];
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(board[r][c].player!==player||!board[r][c].unit)continue;
    for(const m of getValidMoves(r,c,0)){
      moves.push({r1:r,c1:c,...m});
    }
  }
  return moves;
}

/* --- Risque d'exposition : nombre d'ennemis adjacents à (r,c) --- */
function aiExposureRisk(r,c){
  let risk=0;
  for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
    const nr=r+dr,nc=c+dc;
    if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&board[nr][nc].player===1)risk++;
  }
  return risk;
}