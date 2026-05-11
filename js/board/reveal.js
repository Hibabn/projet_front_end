/* ══════════════════ REVEAL LOGIC ══════════════════ */

// révèle une case spéciale (bonus ou piège) si elle n’est pas encore connue
function revealCellIfSpecial(r, c){

  const k = `${r},${c}`; // clé unique de la case (ex: "2,3")

  if(
    (board[r][c].bonus || board[r][c].trap) && 
    !revealedCells.has(k)
  ){
    // si c’est une case spéciale ET pas encore révélée

    revealedCells.add(k); // on la marque comme révélée

    const type = board[r][c].bonus ? 'Bonus ✦' : 'Piège ✗';  // identifie le type de case

    addLog(`👁 Case (${r},${c}) révélée : ${type}`, 'info'); 
  }
}


/* ══════════════════ REVEAL AUTOUR DES UNITÉS ══════════════════ */

// révèle les cases spéciales autour de toutes les unités d’un joueur
function revealAroundUnits(){

  for(let r=0; r<SIZE; r++)
    for(let c=0; c<SIZE; c++){

      if(board[r][c].unit){   // si une unité est présente sur cette case

        /* on vérifie la case + les 8 cases autour (3x3) */
        for(let dr=-1; dr<=1; dr++)
          for(let dc=-1; dc<=1; dc++){

            const nr = r + dr; // nouvelle ligne
            const nc = c + dc; // nouvelle colonne

            if(
              nr >= 0 && nr < SIZE &&   // dans la grille
              nc >= 0 && nc < SIZE &&   // dans la grille
              (board[nr][nc].bonus || board[nr][nc].trap)
            ){
              // si la case autour est spéciale

              revealCellIfSpecial(nr, nc); 
              // on la révèle
            }
          }
      }
    }
}