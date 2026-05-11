/* ══════════════════ DICE carré de dé 58px × 58px. ══════════════════ */

const PIP={
  1:[[29,29]], // 1 point du dé
  2:[[15,15],[43,43]], // 2 points diagonaux
  3:[[15,15],[29,29],[43,43]], // 3 points 
  4:[[15,15],[43,15],[15,43],[43,43]], // 4 coins
  5:[[15,15],[43,15],[29,29],[15,43],[43,43]], // 4 coins + centre
  6:[[15,15],[43,15],[15,29],[43,29],[15,43],[43,43]] // 6 faces
};

function renderDiceFace(v){
  return (PIP[v]||[]) // récupère les points du dé
    .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#e8588a"/>`) // crée un point SVG
    .join(''); // assemble les points
}

function animateDice(finalVal,elId){
  return new Promise(resolve=>{ // animation async
    const el=document.getElementById(elId); // récupère dé HTML
    let count=0;

    const iv=setInterval(()=>{ // animation de roulage
      const v=Math.ceil(Math.random()*6); // valeur aléatoire
      if(el)el.innerHTML=renderDiceFace(v); // affiche face du dé

      if(++count>=9){ // après 9 frames
        clearInterval(iv); // stop animation
        if(el)el.innerHTML=renderDiceFace(finalVal); // affiche résultat final
        resolve(); // termine la promesse
      }

    },65); // vitesse du dé (65ms)
  });
}