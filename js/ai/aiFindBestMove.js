/* ══════════════════ AI FIND BEST MOVE ══════════════════ */

// fonction principale : choisit le meilleur mouvement de l’IA
function aiFindBestMove(pts, level){

  const moves = aiGetAllMoves(2, pts);  // récupère tous les mouvements possibles de l’IA (joueur 2)

  if(moves.length === 0) return null; // si aucun mouvement possible → rien à faire

  aiUpdateMemory();  // met à jour les infos connues par l’IA (pièges, bonus…)


  /* ═══════════ NIVEAU FACILE ═══════════ */

  if(level === 'ai-easy'){   // IA simple : joue au hasard

    const safe = moves.filter(m => 
      !aiKnownTraps.has(`${m.r2},${m.c2}`)
    );// enlève les cases connues comme pièges

    const pool = safe.length > 0 ? safe : moves;   // si pas de safe → prend tout

    return pool[Math.floor(Math.random() * pool.length)];
    // choix totalement aléatoire
  }


  /* ═══════════ NIVEAU MOYEN ═══════════ */

  if(level === 'ai-medium'){

    // IA intermédiaire : logique simple

    const safe = moves.filter(m => 
      !aiKnownTraps.has(`${m.r2},${m.c2}`)
    );
    // évite les pièges connus

    const pool = safe.length > 0 ? safe : moves;

    const attacks = pool.filter(m => 
      board[m.r2][m.c2].player === 1
    );
    // cherche les attaques possibles

    if(attacks.length > 0){

      attacks.sort((a,b) => {

        const pa =
          UNITS[board[a.r2][a.c2].unit].power +
          (board[a.r2][a.c2].bonusBuff ? 1 : 0);

        const pb =
          UNITS[board[b.r2][b.c2].unit].power +
          (board[b.r2][b.c2].bonusBuff ? 1 : 0);

        return pa - pb;
        // attaque d’abord les unités faibles
      });

      return attacks[0];
      // choisit la meilleure attaque
    }

    const knownBonusMoves = pool.filter(m => 
      aiKnownBonus.has(`${m.r2},${m.c2}`)
    );
    // bonus déjà connus

    if(knownBonusMoves.length > 0)
      return knownBonusMoves[0];

    const bonusMoves = pool.filter(m => 
      board[m.r2][m.c2].bonus
    );
    // bonus visibles

    if(bonusMoves.length > 0)
      return bonusMoves[0];

    const neutral = pool.filter(m => 
      board[m.r2][m.c2].owner === 0
    );
    // cases neutres

    if(neutral.length > 0)
      return neutral[Math.floor(Math.random() * neutral.length)];

    return pool[Math.floor(Math.random() * pool.length)];
  }


  /* ═══════════ NIVEAU HARD ═══════════ */

  if(level === 'ai-hard'){

    let best = null; 
    let bestScore = -Infinity;
    // meilleur coup trouvé

    for(const m of moves){

      let score = 0;  // score du mouvement

      const target = board[m.r2][m.c2];  // case cible

      const k = `${m.r2},${m.c2}`;  // clé case

      const myUnit = board[m.r1][m.c1].unit; // unité actuelle

      const myPow =
        UNITS[myUnit].power +
        (board[m.r1][m.c1].bonusBuff ? 1 : 0);
      // puissance totale


      /* ═══════════ MALUS / RISQUES ═══════════ */

      if(aiKnownTraps.has(k)){
        score = -999; 
        // piège connu → très mauvais
      }

      else if(target.trap && revealedCells.has(k)){
        score = -200; 
        // piège révélé → dangereux
      }


      /* ═══════════ ATTAQUE ═══════════ */

      else if(target.player === 1){

        const enPow =
          UNITS[target.unit].power +
          (target.bonusBuff ? 1 : 0);

        const winProb =
          Math.max(0.05,
          Math.min(0.95, (myPow - enPow + 3.5) / 7));

        // probabilité de victoire

        const killVal = UNITS[target.unit].killPts;

        score = winProb * killVal * 12;
        // récompense attaque réussie

        if(board[m.r1][m.c1].bonusBuff)
          score += 8;

        if(winProb < 0.4)
          score -= 10;
      }


      /* ═══════════ BONUS ═══════════ */

      else if(aiKnownBonus.has(k)){
        score = 20; 
        // bonus connu
      }

      else if(target.bonus){
        score = 14; 
        // bonus visible
      }


      /* ═══════════ EXPANSION ═══════════ */

      else if(target.owner === 1){
        score = 6; 
        // case ennemie faible
      }

      else if(target.owner === 0){
        score = 3; 
        // case neutre

        const distCenter =
          Math.abs(m.r2 - SIZE/2) +
          Math.abs(m.c2 - SIZE/2);

        score += Math.max(0, 4 - distCenter * 0.5);
        // préfère centre

        score += aiExpansionValue(m.r2, m.c2);
        // bonus expansion
      }


      /* ═══════════ RISQUE ═══════════ */

      const exposure = aiExposureRisk(m.r2, m.c2);
      score -= exposure * 3;
      // pénalise zones dangereuses


      /* ═══════════ BONUS STRATÉGIQUES ═══════════ */

      if(myUnit === 'T' && target.owner !== 2)
        score += 2;
      // tour = agressif

      if(m.r2 < m.r1 && m.r1 > SIZE - 3)
        score -= 2;
      // évite mauvais déplacement


      /* meilleur choix */
      if(score > bestScore){
        bestScore = score;
        best = m;
      }
    }

    return best || moves[0];
    // retourne meilleur move trouvé
  }


  /* fallback */
  return moves[0];
}