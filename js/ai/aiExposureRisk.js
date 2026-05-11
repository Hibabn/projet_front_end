// mesure du danger autour d’une case


function aiExposureRisk(r,c){

  let risk = 0;  // compteur du danger autour de la case

  // on regarde les 4 cases adjacentes (haut, bas, gauche, droite)
  for(const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]){

    const nr = r + dr; // nouvelle ligne
    const nc = c + dc; // nouvelle colonne

    if(
      nr >= 0 && nr < SIZE &&   // dans la grille
      nc >= 0 && nc < SIZE &&   // dans la grille
      board[nr][nc].player === 1 // présence ennemi (joueur 1)
    ){
      risk++; // chaque ennemi adjacent augmente le risque
    }
  }

  return risk; // retourne le niveau de danger de la case
}