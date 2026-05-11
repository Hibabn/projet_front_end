function aiExpansionValue(r, c){
  let val = 0;
  for(const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]){
    const nr=r+dr, nc=c+dc;
    if(nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE){
      if(board[nr][nc].owner===0) val += 0.5; // voisin neutre = potentiel expansion
      if(board[nr][nc].owner===1) val += 1.0; // voisin ennemi = pression
    }
  }
  return val;
}

/* --- Lister tous les mouvements valides d'un joueur --- */
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