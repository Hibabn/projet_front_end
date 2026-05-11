/* ══════════════════ GAME STATE ══════════════════ */ // Début de la mémoire globale du jeu

let SIZE = 8; // Taille du plateau

let board = []; // Grille principale
let currentPlayer = 1; // Joueur actif (1 ou 2)
let selectedCell = null; // Case actuellement sélectionnée

let movePoints = 0; // Points de déplacement disponibles
let diceRolled = false; // Indique si le dé a été lancé
let startRolls = [0,0]; // Résultats des dés de départ

let bonusCells = new Set(); // Cases bonus sur la map
let trapCells = new Set(); // Cases pièges sur la map
let revealedCells = new Set(); // Cases déjà révélées

let initialUnits = { 1:[], 2:[] }; // Unités initiales de chaque joueur
let placedUnits = { 1:[], 2:[] }; // Unités déjà placées

let killPoints = { 1:0, 2:0 }; // Score de kills des joueurs

let placementPhase = true; // Phase de placement active ou non
let placePlayer = 1; // Joueur qui place ses unités
let placeUnitType = 'S'; // Type d’unité sélectionnée pour placement
let placeUnitsLeft = { 1:[], 2:[] }; // Unités restantes à placer

let timerInterval = null; // Intervalle du timer
let timerRemain = 0; // Temps restant du timer

const CIRCUMFERENCE = 2 * Math.PI * 20; // Valeur utilisée pour animation circulaire (UI timer)

// Sauvegarde de l’état du plateau (pour reset ou undo)
let boardSnapshot = null;

/* ══════════════════ MODAL DE DÉPART ══════════════════ */

// HTML de la fenêtre de lancement du jeu
const MODAL_ORIGINAL_HTML = `
  <h2>⚔ Conquête des Territoires</h2> 

  <p>Chaque joueur lance un dé — le plus grand score détermine qui commence la bataille.</p> 

  <div class="player-roll"> 

    <div style="text-align:center">
      <div class="prn p1" id="roll-name-p1">Alice</div>
      <div class="prv" id="roll-p1">—</div> 
    </div>

    <div style="font-size:1.4rem;color:rgba(255,255,255,0.1);margin-top:12px">vs</div>

    <div style="text-align:center">
      <div class="prn p2" id="roll-name-p2">Bob</div> 
      <div class="prv" id="roll-p2">—</div> 
    </div>

  </div>

  <button class="dice-roll-btn" id="btn-roll-p1" onclick="startRoll(1)">
    🎲 <span id="rbtn-name-p1">Alice</span> lance le dé
  </button> 

  <button class="dice-roll-btn" id="btn-roll-p2" onclick="startRoll(2)" disabled>
    🎲 <span id="rbtn-name-p2">Bob</span> lance le dé
  </button> 

  <button class="btn-modal" id="btn-start" onclick="startGame()" style="display:none">
    ⚔ Commencer la Bataille !
  </button> 
`;