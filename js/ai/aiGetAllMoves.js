
/* --- récupère tous les mouvements possibles d’un joueur --- */
function aiGetAllMoves(player, pts){

  const moves = []; // liste qui va contenir tous les coups possibles

  // parcours toute la grille
  for(let r=0; r<SIZE; r++)
    for(let c=0; c<SIZE; c++){

      // on ignore si ce n’est pas une unité du joueur
      // ou s’il n’y a pas d’unité
      if(board[r][c].player !== player || !board[r][c].unit)
        continue;

      // récupère tous les déplacements possibles de cette unité
      for(const m of getValidMoves(r, c, 0)){

        // ajoute le mouvement avec position de départ + arrivée
        moves.push({
          r1: r,   // ligne de départ
          c1: c,   // colonne de départ
          ...m     // position d’arrivée (r2, c2)
        });
      }
    }

  return moves;// retourne tous les mouvements possibles du joueur
}


/* --- calcule le risque dexposition d’une case --- */
function aiExposureRisk(r, c){

  let risk = 0;
  // compteur de danger autour de la case

  // directions : droite, gauche, bas, haut
  for(const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]){

    const nr = r + dr; // nouvelle ligne
    const nc = c + dc; // nouvelle colonne

    // vérifie que la case existe dans la grille
    if(
      nr >= 0 && nr < SIZE &&
      nc >= 0 && nc < SIZE &&
      board[nr][nc].player === 1
    ){
      risk++;
      // chaque ennemi adjacent augmente le danger
    }
  }

  return risk;
  // retourne le niveau de risque de la case
}