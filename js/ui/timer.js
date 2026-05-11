/* ══════════════════ TIMER ══════════════════ */

const CIRC=125.66; // longueur totale du cercle (périmètre du timer SVG)

function startTimer(){
  stopTimer();  // stop ancien timer si existe

  if(CFG.timerSec===0){
    document.getElementById('timer-wrap').classList.add('timer-disabled');
    // désactive visuellement le timer

    document.getElementById('timer-num').textContent='—';
    // affiche rien

    document.getElementById('ring-fill').style.strokeDashoffset='0';
    // cercle vide

    return; // sort
  }

  document.getElementById('timer-wrap').classList.remove('timer-disabled');
  // active le timer visuellement

  timerRemain=CFG.timerSec;
  // initialise temps restant

  updateTimerUI(); 
  // met à jour affichage

  timerInterval=setInterval(()=>{
    timerRemain--; // diminue chaque seconde
    updateTimerUI(); // met à jour UI

    if(timerRemain<=0){
      stopTimer(); 
      timerExpired(); // fin du temps
    }
  },1000);
}

function stopTimer(){
  if(timerInterval){
    clearInterval(timerInterval); // stop interval
    timerInterval=null;
  }
}

function updateTimerUI(){
  const ratio=timerRemain/CFG.timerSec;
  // proportion du temps restant

  const offset=CIRC-(ratio*CIRC);
  // calcule progression du cercle

  const fill=document.getElementById('ring-fill');
  const num=document.getElementById('timer-num');

  fill.style.strokeDashoffset=offset;
  // anime cercle (progress bar circulaire)

  fill.style.stroke=
    timerRemain<=10 ? '#ff4040' :
    timerRemain<=20 ? '#f4a261' :
    'var(--rose)';
  // change couleur selon urgence

  num.textContent=timerRemain;
  // affiche temps restant

  num.className='timer-num'+(timerRemain<=10?' urgent':'');
  // ajoute style urgent si danger

  document.getElementById('timer-wrap')
    .style.setProperty('--timer-color',
      timerRemain<=10?'#ff4040':'var(--rose)');
  // variable CSS pour couleur dynamique
}

function timerExpired(){
  addLog(`⏱ Temps écoulé ! Tour de ${currentPlayer===1?CFG.p1:CFG.p2} terminé automatiquement.`,'timer-out');
  // affiche message log

  endTurn();
  // passe au tour suivant automatiquement
}