/* ══════════════════ INITIALISATION FX LAYER ══════════════════ */

(function(){
  const d=document.createElement('div'); // crée une div pour les effets visuels
  d.id='fx-layer'; // id de la couche FX
  document.body.appendChild(d); // ajoute la couche au body
})();


/* ══════════════════ Placement des effets EXACTEMENT sur une unité══════════════════ */

function getCellCenter(r,c){
  const el=document.getElementById(`c${r}_${c}`); // récupère la case
  if(!el)return{x:0,y:0}; // sécurité si case inexistante
  const rect=el.getBoundingClientRect(); // position écran de la case
  return{x:rect.left+rect.width/2,y:rect.top+rect.height/2}; // centre de la case
}


/*  EXPLOSIONS VISUELLES  */
function spawnParticles(x,y,color,count=12,isKill=false){
  const layer=document.getElementById('fx-layer'); // couche FX
  const size=isKill?10:6; // taille des particules

  for(let i=0;i<count;i++){ // boucle particules
    const s=document.createElement('div'); // crée particule
    s.className='spark'; // classe CSS

    const angle=Math.random()*Math.PI*2; // direction aléatoire
    const dist=isKill?(40+Math.random()*60):(15+Math.random()*25); // distance explosion

    const tx=Math.cos(angle)*dist; // déplacement X
    const ty=Math.sin(angle)*dist; // déplacement Y

    const sz=size*(0.5+Math.random()*0.8); // taille variable

    s.style.cssText=`width:${sz}px;height:${sz}px;background:${color};left:${x-sz/2}px;top:${y-sz/2}px;--tx:${tx}px;--ty:${ty}px;animation-duration:${0.4+Math.random()*0.5}s;animation-delay:${Math.random()*0.1}s;box-shadow:0 0 ${sz*2}px ${color};`;

    layer.appendChild(s); // ajoute particule à l’écran
    setTimeout(()=>s.remove(),900); // suppression après animation
  }
}

/* texte “KILL” */
function spawnKillBanner(text){
  const b=document.createElement('div'); // crée banner
  b.className='kill-banner'; // style CSS
  b.textContent=text; // texte affiché

  document.body.appendChild(b); // affiche sur écran
  setTimeout(()=>b.remove(),1500); // disparaît après 1.5s
}

/* animation d’unité */
function animatePiece(r,c,animClass,duration=500){
  const el=document.getElementById(`c${r}_${c}`); // case
  if(!el)return;

  const piece=el.querySelector('.piece-3d'); // unité dans la case
  if(!piece)return;

  piece.classList.add(animClass); // lance animation CSS
  setTimeout(()=>piece.classList.remove(animClass),duration); // stop animation
}

/* tremblement du plateau */
function shakeBoard(){
  const b=document.getElementById('board'); // plateau
  b.classList.add('board-shake'); // active shake
  setTimeout(()=>b.classList.remove('board-shake'),380); // stop shake
}

/* flash sur une case */
function flashCell(r,c){
  const el=document.getElementById(`c${r}_${c}`); // case
  if(!el)return;

  el.classList.add('cell-flash'); // flash visuel
  setTimeout(()=>el.classList.remove('cell-flash'),400); // stop flash
}