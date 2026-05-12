/* ══════════════════ UNIT DEFINITIONS ══════════════════ */
const UNITS = {
  S: { label:'Soldat',   /* `maxStep` is a property of each unit defined in the `UNITS` object. It
  represents the maximum number of steps that unit can move in a straight
  line in any direction (horizontal or vertical) on the game board. This
  property is used in the `getValidMoves` function to determine the range of
  valid moves for a given unit based on its maximum step value. */
  maxStep:1, power:2, killPts:2, short:'S', moveType:'straight' }, // horizontal/vertical 1 case
  C: { label:'Cavalier', maxStep:2, power:1, killPts:3, short:'C', moveType:'straight' }, // horizontal/vertical 1-2 cases
  T: { label:'Tank',     maxStep:1, power:3, killPts:5, short:'T', moveType:'straight' }  // horizontal/vertical 1 case
};

/* Directions horizontales et verticales uniquement */
const STRAIGHT_DIRS = [[0,1],[0,-1],[1,0],[-1,0]];

/* Retourne toutes les cases cibles valides pour une unité en (r,c) */
function getValidMoves(r, c, pts){
  const unit  = board[r][c].unit;      // Récupère unité sur case 
  const reach = UNITS[unit].maxStep;   // Chercher max step
  const targets = [];

  for(const [dr, dc] of STRAIGHT_DIRS){
    for(let d = 1; d <= reach; d++){
      const nr = r + dr * d;    //nouvelle ligne
      const nc = c + dc * d;    //nouvelle colonne

      if(nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break; // hors carte
      if(board[nr][nc].player === board[r][c].player)  break; // Empêcher une unité de passer sur une unité ami

      targets.push({ r2: nr, c2: nc, dist: d });

      if(board[nr][nc].player !== 0) break; // ennemi → on peut attaquer mais pas traverser
    }
  }

  return targets;
}