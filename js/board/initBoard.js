/* ══════════════════ BOARD DATA INIT ══════════════════ */
let _bonusCount = 4, _trapCount = 4;

function initBoardData(bonusCount, trapCount){
  _bonusCount = bonusCount; _trapCount = trapCount;
  bonusCells=new Set(); trapCells=new Set(); revealedCells=new Set();

  for(let r=0;r<SIZE;r++){
    board[r]=[];
    for(let c=0;c<SIZE;c++){
      board[r][c]={player:0,owner:0,unit:null,bonus:false,trap:false,startZone:0,bonusBuff:false,defending:false};
    }
  }

  /* P1 : 2 premières lignes complètes (haut) */
  for(let r=0;r<2;r++)
    for(let c=0;c<SIZE;c++)
      board[r][c].startZone=1;

  /* P2 : 2 dernières lignes complètes (bas) */
  for(let r=SIZE-2;r<SIZE;r++)
    for(let c=0;c<SIZE;c++)
      board[r][c].startZone=2;

  placeSpecials(bonusCount, trapCount);
}

function placeSpecials(bonusCount, trapCount){
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){board[r][c].bonus=false;board[r][c].trap=false;}
  bonusCells=new Set(); trapCells=new Set();
  const midMin=2, midMax=SIZE-3;
  const placed=new Set();

  function rndMid(){
    let r,c,k,tries=0;
    do{
      r=midMin+Math.floor(Math.random()*(midMax-midMin+1));
      c=midMin+Math.floor(Math.random()*(midMax-midMin+1));
      k=`${r},${c}`; tries++;
    }while((placed.has(k)||board[r][c].startZone||board[r][c].unit)&&tries<200);
    placed.add(k); return[r,c,k];
  }

  for(let i=0;i<bonusCount;i++){const[r,c,k]=rndMid();board[r][c].bonus=true;bonusCells.add(k);}
  for(let i=0;i<trapCount;i++){const[r,c,k]=rndMid();board[r][c].trap=true;trapCells.add(k);}
}

function reshuffleSpecials(){
  placeSpecials(_bonusCount, _trapCount);
  revealedCells = new Set();
  addLog('🌀 Les cases spéciales se sont déplacées…', 'info');
}