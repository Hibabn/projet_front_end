/* ══════════════════ REVEAL LOGIC ══════════════════ */
function revealCellIfSpecial(r, c){
  const k=`${r},${c}`;
  if((board[r][c].bonus||board[r][c].trap)&&!revealedCells.has(k)){
    revealedCells.add(k);
    const type = board[r][c].bonus ? 'Bonus ✦' : 'Piège ✗';
    addLog(`👁 Case (${r},${c}) révélée : ${type}`, 'info');
  }
}
/* Reveal special cells adjacent (including diagonals) to all current units of a player */
function revealAroundUnits(){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    if(board[r][c].unit){
      /* check the cell itself and 8 neighbors */
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&(board[nr][nc].bonus||board[nr][nc].trap)){
          revealCellIfSpecial(nr,nc);
        }
      }
    }
  }
}