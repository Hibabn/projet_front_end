/* ══════════════════ BOARD DATA INIT ══════════════════ */

let _bonusCount = 4, _trapCount = 4; 

// initialise toute la grille du jeu
function initBoardData(bonusCount, trapCount){

  _bonusCount = bonusCount; 
  _trapCount = trapCount; 

  bonusCells = new Set(); 
  trapCells = new Set(); 
  revealedCells = new Set(); 

  // création du plateau vide
  for(let r=0; r<SIZE; r++){

    board[r] = []; 
    // crée une ligne

    for(let c=0; c<SIZE; c++){

      board[r][c] = {
        player: 0,        // aucun joueur
        owner: 0,         // pas de contrôle
        unit: null,       // pas d’unité
        bonus: false,     // pas de bonus
        trap: false,      // pas de piège
        startZone: 0,     // zone de départ
        bonusBuff: false, // bonus actif combat
        defending: false  // mode défense
      };
    }
  }


  /* zone de départ joueur 1 */
  for(let r=0; r<2; r++)       // 2 premières lignes
    for(let c=0; c<SIZE; c++)
      board[r][c].startZone = 1;


  /* zone de départ joueur 2 */
  for(let r=SIZE-2; r<SIZE; r++) // 2 dernières lignes
    for(let c=0; c<SIZE; c++)
      board[r][c].startZone = 2;


  placeSpecials(bonusCount, trapCount); 
  // place les bonus et pièges
}

/* ══════════════════ PLACEMENT BONUS / TRAPS ══════════════════ */

function placeSpecials(bonusCount, trapCount){

  // reset toutes les cases spéciales
  for(let r=0; r<SIZE; r++)
    for(let c=0; c<SIZE; c++){
      board[r][c].bonus = false;
      board[r][c].trap = false;
    }

  bonusCells = new Set(); // reset bonus
  trapCells = new Set();   // reset pièges

  const midMin = 2; // zone centrale min
  const midMax = SIZE - 3; // zone centrale max

  const placed = new Set(); // évite doublons


  // génère une case centrale aléatoire valide
  function rndMid(){

    let r, c, k, tries = 0;

    do{
      r = midMin + Math.floor(Math.random()*(midMax-midMin+1));
      c = midMin + Math.floor(Math.random()*(midMax-midMin+1));
      k = `${r},${c}`; // clé case
      tries++;

    } while(
      (placed.has(k) ||               // déjà utilisé
       board[r][c].startZone ||       // zone de départ
       board[r][c].unit) &&           // occupée
      tries < 200
    );

    placed.add(k); // marque case utilisée

    return [r,c,k]; // retourne position
  }


  // place les bonus
  for(let i=0; i<bonusCount; i++){

    const [r,c,k] = rndMid();

    board[r][c].bonus = true; // active bonus
    bonusCells.add(k);        // enregistre
  }


  // place les pièges
  for(let i=0; i<trapCount; i++){

    const [r,c,k] = rndMid();

    board[r][c].trap = true; // active piège
    trapCells.add(k);        // enregistre
  }
}

/* ══════════════════ REFRESH SPECIALS ══════════════════ */
// remet aléatoirement les bonus et pièges

function reshuffleSpecials(){

  placeSpecials(_bonusCount, _trapCount); // recrée les positions

  revealedCells = new Set();  // reset des cases révélées

  addLog('🌀 Les cases spéciales se sont déplacées…', 'info'); 
}