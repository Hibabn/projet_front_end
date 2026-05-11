/* ══════════════════ DIFFICULTY CONFIG ══════════════════ */
const DIFF_CONFIG = {
  easy:   { units:['T','S','C','S','S'],                               bonusCount:4, trapCount:4  },
  medium: { units:['T','S','C','S','S','T','C'],                       bonusCount:6, trapCount:6  },
  hard:   { units:['T','T','S','C','S','S','C','S','S'],               bonusCount:8, trapCount:10 }
};

/* ══════════════════ GAME CONFIG ══════════════════ */
let CFG = { p1:'Alice', p2:'Bob', size:8, diff:'easy', timerSec:0, mode:'pvp', aiLevel:'ai-medium' };
let WIN_GOAL = 33;

/* ══════════════════ MODE SELECT ══════════════════ */
function selectMode(el, mode){
  document.getElementById('mode-opts').querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('selected','sel-v','sel-g'));   // Retire la sélection des boutons
  el.classList.add('selected');   // Sélectionne le bouton cliqué

  if(mode==='pvp'){
    document.getElementById('ai-section').style.display='none';     // Cache les options IA
    document.getElementById('p2-box').style.opacity='1';           // Active le joueur 2
    document.getElementById('p2-name').disabled=false;
    if(document.getElementById('p2-name').value==='Ordinateur')document.getElementById('p2-name').value='Bob';
  } else {
    document.getElementById('ai-section').style.display='block';      // Affiche les options IA
    document.getElementById('p2-box').style.opacity='0.5';         // Désactive le joueur 2
    document.getElementById('p2-name').value='Ordinateur';
    document.getElementById('p2-name').disabled=true;
  }
}