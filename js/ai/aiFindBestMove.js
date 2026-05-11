/* ══════════════════ AI FIND BEST MOVE ══════════════════ */

function aiFindBestMove(pts, level){
  const moves = aiGetAllMoves(2, pts);
  if(moves.length === 0) return null;
  aiUpdateMemory();

  if(level === 'ai-easy'){
    /* Facile : mouvement aléatoire, évite juste les pièges déjà connus */
    const safe = moves.filter(m => !aiKnownTraps.has(`${m.r2},${m.c2}`));
    const pool = safe.length > 0 ? safe : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if(level === 'ai-medium'){
    /* Moyen : priorise attaque > bonus connus > neutre > évite pièges */
    const safe = moves.filter(m => !aiKnownTraps.has(`${m.r2},${m.c2}`));
    const pool = safe.length > 0 ? safe : moves;

    const attacks = pool.filter(m => board[m.r2][m.c2].player === 1);
    if(attacks.length > 0){
      attacks.sort((a,b) => {
        const pa = UNITS[board[a.r2][a.c2].unit].power + (board[a.r2][a.c2].bonusBuff ? 1 : 0);
        const pb = UNITS[board[b.r2][b.c2].unit].power + (board[b.r2][b.c2].bonusBuff ? 1 : 0);
        return pa - pb; // attaquer le plus faible d'abord
      });
      return attacks[0];
    }
    const knownBonusMoves = pool.filter(m => aiKnownBonus.has(`${m.r2},${m.c2}`));
    if(knownBonusMoves.length > 0) return knownBonusMoves[0];
    const bonusMoves = pool.filter(m => board[m.r2][m.c2].bonus);
    if(bonusMoves.length > 0) return bonusMoves[0];
    const neutral = pool.filter(m => board[m.r2][m.c2].owner === 0);
    if(neutral.length > 0) return neutral[Math.floor(Math.random() * neutral.length)];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if(level === 'ai-hard'){
    /* Expert : score chaque mouvement avec stratégie avancée */
    let best = null, bestScore = -Infinity;
    for(const m of moves){
      let score = 0;
      const target = board[m.r2][m.c2];
      const k = `${m.r2},${m.c2}`;
      const myUnit = board[m.r1][m.c1].unit;
      const myPow = UNITS[myUnit].power + (board[m.r1][m.c1].bonusBuff ? 1 : 0);

      if(aiKnownTraps.has(k)){
        score = -999;
      } else if(target.trap && revealedCells.has(k)){
        score = -200;
      } else if(target.player === 1){
        const enPow = UNITS[target.unit].power + (target.bonusBuff ? 1 : 0);
        const winProb = Math.max(0.05, Math.min(0.95, (myPow - enPow + 3.5) / 7));
        const killVal = UNITS[target.unit].killPts;
        score = winProb * killVal * 12;
        if(board[m.r1][m.c1].bonusBuff) score += 8;
        if(winProb < 0.4) score -= 10;
      } else if(aiKnownBonus.has(k)){
        score = 20;
      } else if(target.bonus){
        score = 14;
      } else if(target.owner === 1){
        score = 6;
      } else if(target.owner === 0){
        score = 3;
        const distCenter = Math.abs(m.r2 - SIZE/2) + Math.abs(m.c2 - SIZE/2);
        score += Math.max(0, 4 - distCenter * 0.5);
        score += aiExpansionValue(m.r2, m.c2);
      }

      const exposure = aiExposureRisk(m.r2, m.c2);
      score -= exposure * 3;

      if(myUnit === 'T' && target.owner !== 2) score += 2;
      if(m.r2 < m.r1 && m.r1 > SIZE - 3) score -= 2;

      if(score > bestScore){ bestScore = score; best = m; }
    }
    return best || moves[0];
  }

  return moves[0];
}