function aiExposureRisk(r,c){
  let risk=0;
  for(const[dr,dc]of[[0,1],[0,-1],[1,0],[-1,0]]){
    const nr=r+dr,nc=c+dc;
    if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&board[nr][nc].player===1)risk++;
  }
  return risk;
}

/* ══════════════════ LOG ══════════════════ */