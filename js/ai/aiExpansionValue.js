/* calcule la valeur d’expansion d’une case */

function aiExpansionValue(r, c){

  let val = 0;  // score d’intérêt de la case

  // on regarde les 4 directions autour (haut, bas, gauche, droite)
  for(const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]){

    const nr = r + dr; // nouvelle ligne
    const nc = c + dc; // nouvelle colonne

    if(nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE){

      if(board[nr][nc].owner === 0)
        val += 0.5;  // case neutre → bon potentiel d’expansion

      if(board[nr][nc].owner === 1)
        val += 1.0; // case ennemie → pression / opportunité de capture
    }
  }

  return val;  // retourne la valeur totale de la case
}


/* --- liste tous les mouvements possibles d’un joueur --- */
function aiGetAllMoves(player, pts){

  const moves = []; 
  // liste de tous les coups possibles

  for(let r=0; r<SIZE; r++)
    for(let c=0; c<SIZE; c++){

      if(
        board[r][c].player !== player || // pas le bon joueur
        !board[r][c].unit                // pas d’unité
      ) continue;

      // récupère tous les déplacements possibles de cette unité
      for(const m of getValidMoves(r,c,0)){

        moves.push({
          r1: r, 
          c1: c,
          ...m // destination du move
        });
      }
    }

  return moves; 
  // retourne tous les coups possibles du joueur
}
