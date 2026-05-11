/* ══════════════════ COMBAT DICE MODAL CONTROLLER ══════════════════ */

let _combatPending = null;  // stocke les infos du combat pour après fermeture du modal

// affiche le modal de combat entre 2 unités
function showCombatModal(r1,c1,r2,c2,autoClose=false){

  const aUnit = board[r1][c1].unit; // unité attaquante
  const dUnit = board[r2][c2].unit; // unité défenseur

  const ab = board[r1][c1].bonusBuff ? 1 : 0; // bonus attaque
  const db = board[r2][c2].bonusBuff ? 1 : 0; // bonus défense

  const defendBonus = board[r2][c2].defending ? 2 : 0; // bonus défense

  const ad = Math.ceil(Math.random()*6); // dé attaquant
  const dd = Math.ceil(Math.random()*6); // dé défenseur

  const aBase = UNITS[aUnit].power; // force unité attaque
  const dBase = UNITS[dUnit].power; // force unité défense

  const aTotal = aBase + ad + ab; // score total attaque
  const dTotal = dBase + dd + db + defendBonus; // score total défense

  const an = currentPlayer===1 ? CFG.p1 : CFG.p2; // nom attaquant
  const dn = currentPlayer===1 ? CFG.p2 : CFG.p1; // nom défenseur


  // détermine le gagnant du combat
  let attackerWins, resultMsg, resultClass;

  // si les scores sont différents
  if(aTotal !== dTotal){
    attackerWins = aTotal > dTotal; // plus grand gagne

  } else {  // cas égalité → départage par score global

    let ts1 = 0, ts2 = 0; // territoires

    for(let rr=0; rr<SIZE; rr++)
      for(let cc=0; cc<SIZE; cc++){

        if(board[rr][cc].owner===1) ts1++; // score joueur 1
        if(board[rr][cc].owner===2) ts2++; // score joueur 2
      }

    const aScore = (currentPlayer===1 ? ts1 : ts2) + killPoints[currentPlayer];
    const dPlayer = currentPlayer===1 ? 2 : 1;
    const dScore = (dPlayer===1 ? ts1 : ts2) + killPoints[dPlayer];

    if(aScore > dScore) attackerWins = true;
    else if(dScore > aScore) attackerWins = false;
    else attackerWins = false;
  }


  // message du résultat
  if(aTotal === dTotal){
    resultMsg = `⚖ Égalité ! Avantage défenseur — ${dn} résiste.`;
    resultClass = 'draw';

  } else if(attackerWins){
    resultMsg = `✿ ${an} remporte le combat !`;
    resultClass = 'p1-win';

  } else {
    resultMsg = `💀 ${dn} défend avec succès ! ${an} est éliminé.`;
    resultClass = 'p2-win';
  }


  // stocke toutes les infos du combat
  _combatPending = {
    r1,c1,r2,c2,aUnit,dUnit,
    ab,db,defendBonus,
    ad,dd,
    aBase,dBase,
    aTotal,dTotal,
    an,dn,
    attackerWins,
    resultMsg,
    resultClass,
    isAI:autoClose
  };


  /* ═══════════ MODAL SETUP ═══════════ */

  document.getElementById('cm-subtitle').textContent =
    'Les dés décident du sort…'; // texte intro

  const atkIsP1 = currentPlayer === 1; // qui attaque ?

  // nom attaquant
  document.getElementById('cm-atk-name').textContent = an;
  document.getElementById('cm-atk-name').className =
    'cm-fighter-name ' + (atkIsP1 ? 'p1' : 'p2');

  // icône attaquant
  document.getElementById('cm-atk-icon').className =
    'cm-unit-icon ' + (atkIsP1 ? 'p1' : 'p2');

  document.getElementById('cm-atk-icon').innerHTML =
    `<svg width="36" height="36">
      ${pieceSVG(aUnit,currentPlayer)
        .replace(/<svg[^>]*>/,'')
        .replace('</svg>','')}
    </svg>`;


  // type unité attaquante
  document.getElementById('cm-atk-unit').textContent =
    UNITS[aUnit].label + (ab ? ' ✦' : '');


  // nom défenseur
  document.getElementById('cm-def-name').textContent = dn;
  document.getElementById('cm-def-name').className =
    'cm-fighter-name ' + (atkIsP1 ? 'p2' : 'p1');

  // icône défenseur
  document.getElementById('cm-def-icon').className =
    'cm-unit-icon ' + (atkIsP1 ? 'p2' : 'p1');

  const defPlayer = currentPlayer === 1 ? 2 : 1;

  document.getElementById('cm-def-icon').innerHTML =
    `<svg width="36" height="36">
      ${pieceSVG(dUnit,defPlayer)
        .replace(/<svg[^>]*>/,'')
        .replace('</svg>','')}
    </svg>`;

  document.getElementById('cm-def-unit').textContent =
    UNITS[dUnit].label +
    (db ? ' ✦' : '') +
    (defendBonus ? ' 🛡' : '');


  /* ═══════════ RESET DICE DISPLAY ═══════════ */

  const dieAtk = document.getElementById('cm-die-atk');
  const dieDef = document.getElementById('cm-die-def');

  dieAtk.textContent = '?'; // reset dé attaque
  dieDef.textContent = '?'; // reset dé défense

  dieAtk.className = 'cm-die ' + (atkIsP1 ? 'p1-die' : 'p2-die');
  dieDef.className = 'cm-die ' + (atkIsP1 ? 'p2-die' : 'p1-die');


  // reset formules
  document.getElementById('cm-formula-atk').textContent = '';
  document.getElementById('cm-formula-def').textContent = '';

  // reset scores
  document.getElementById('cm-total-atk').textContent = '—';
  document.getElementById('cm-total-def').textContent = '—';

  // reset styles scores
  document.getElementById('cm-total-atk').className = 'cm-score-total p1';
  document.getElementById('cm-total-def').className = 'cm-score-total p2';

  // reset résultat
  const res = document.getElementById('cm-result');
  res.className = 'cm-result';
  res.textContent = '';

  // bouton fermer
  const closeBtn = document.getElementById('cm-close-btn');
  closeBtn.className = 'cm-close-btn';


  /* ═══════════ SHOW MODAL ═══════════ */

  document.getElementById('combat-backdrop').classList.add('open');


  /* ═══════════ ANIMATION DÉS ═══════════ */

  playDiceSound(); // son

  dieAtk.classList.add('rolling');
  dieDef.classList.add('rolling');


  // animation de chiffres aléatoires
  const faces = '123456';
  let shuffleCount = 0;

  const shuffleInterval = setInterval(()=>{

    dieAtk.textContent = faces[Math.floor(Math.random()*6)];
    dieDef.textContent = faces[Math.floor(Math.random()*6)];

    shuffleCount++;

    if(shuffleCount >= 10){
      clearInterval(shuffleInterval);
    }
  },60);


  /* ═══════════ ARRIVÉE DÉS ═══════════ */

  // dé attaquant arrive
  setTimeout(()=>{

    dieAtk.classList.remove('rolling');
    dieAtk.textContent = ad;
    dieAtk.classList.add('landed');

    playDiceSound();

    setTimeout(()=>dieAtk.classList.remove('landed'),400);


    // formule attaque
    setTimeout(()=>{

      let fAtk = `dé(${ad}) + force(${aBase})`;
      if(ab) fAtk += ` + bonus(1)`;

      document.getElementById('cm-formula-atk').textContent = fAtk;
      document.getElementById('cm-total-atk').textContent = aTotal;

    },200);


    // dé défense arrive
    setTimeout(()=>{

      dieDef.classList.remove('rolling');
      dieDef.textContent = dd;
      dieDef.classList.add('landed');

      playDiceSound();

      setTimeout(()=>dieDef.classList.remove('landed'),400);


      // formule défense
      setTimeout(()=>{

        let fDef = `dé(${dd}) + force(${dBase})`;
        if(db) fDef += ` + bonus(1)`;
        if(defendBonus) fDef += ` + défense(2)`;

        document.getElementById('cm-formula-def').textContent = fDef;
        document.getElementById('cm-total-def').textContent = dTotal;


        // résultat final
        setTimeout(()=>{

          if(aTotal > dTotal){
            document.getElementById('cm-total-atk').classList.add('winner');
          } else if(dTotal > aTotal){
            document.getElementById('cm-total-def').classList.add('winner');
          }

          res.className = 'cm-result show ' + resultClass;
          res.textContent = resultMsg;

          document.getElementById('cm-subtitle').textContent =
            aTotal===dTotal ? 'Égalité — départage par score' : 'Les dés ont parlé !';

          closeBtn.classList.add('show');

          // auto close si IA
          if(autoClose)
            setTimeout(()=>closeCombatModal(), 1800);

        },350);

      },200);

    },500);

  },700);
}


/* ══════════════════ CLOSE COMBAT ══════════════════ */

// ferme le modal de combat et applique les résultats
function closeCombatModal(){

  document.getElementById('combat-backdrop').classList.remove('open');

  if(!_combatPending) return;

  const {
    r1,c1,r2,c2,
    aUnit,dUnit,
    ab,db,defendBonus,
    ad,dd,
    aBase,dBase,
    aTotal,dTotal,
    an,dn,
    attackerWins,
    isAI
  } = _combatPending;

  _combatPending = null;


  const aColor = currentPlayer === 1 ? '#e8588a' : '#9b5de5';


  /* LOGS */
  addLog(`⚔ ${an} (${UNITS[aUnit].label}) VS ${dn} (${UNITS[dUnit].label})`,'combat');

  addLog(`  ${an} : dé(${ad}) + force(${aBase})${ab?' + 1 bonus':''} = ${aTotal}`,'combat-detail');

  addLog(`  ${dn} : dé(${dd}) + force(${dBase})${db?' + 1 bonus':''}${defendBonus?' + 2 défense':''} = ${dTotal}${defendBonus?' 🛡':''}`,'combat-detail');


  animatePiece(r1,c1,'anim-attack',500);


  /* SI ATTAQUANT GAGNE */
  if(attackerWins){

    const kpts = UNITS[dUnit].killPts;
    killPoints[currentPlayer] += kpts;

    addLog(`✿ Victoire ${an} ! +${kpts} pts kill [${aTotal}>${dTotal}]`,'kill');

    playCombatSound(true);

    animatePiece(r2,c2,'anim-die',600);

    const dstPt = getCellCenter(r2,c2);

    const killColor =
      dUnit==='T' ? '#f4a261' :
      dUnit==='C' ? '#c090f0' : '#e8588a';

    spawnParticles(dstPt.x,dstPt.y,killColor,20,true);

    shakeBoard();

    const killLabel = {
      T:'💥 TANK DÉTRUIT !',
      C:'⚡ CAVALIER ABATTU !',
      S:'💀 SOLDAT ÉLIMINÉ !'
    }[dUnit];

    spawnKillBanner(killLabel);


    setTimeout(()=>{

      board[r1][c1].bonusBuff = false;
      board[r1][c1].defending = false;

      doMove(r1,c1,r2,c2);

      checkWin();
      renderBoard();

      if(!isAI) endTurn();

    },350);


  /* SI ATTAQUANT PERD */
  } else {

    if(aTotal === dTotal){
      addLog(`⚖ Égalité → avantage défenseur ${dn}`,'combat');
    }

    addLog(`💀 ${an} perd. ${UNITS[aUnit].label} détruit [${aTotal}≤${dTotal}]`,'warn');

    playCombatSound(false);

    animatePiece(r1,c1,'anim-die',600);

    const srcPt = getCellCenter(r1,c1);

    spawnParticles(srcPt.x,srcPt.y,aColor,14,true);

    if(aUnit === 'T'){
      shakeBoard();
    }

    board[r1][c1].bonusBuff = false;
    board[r2][c2].bonusBuff = false;

    board[r1][c1].unit = null;
    board[r1][c1].player = 0;

    checkWin();
    updateMoveUI();
    renderBoard();

    if(!isAI) endTurn();
  }
}


/* ══════════════════ COMBAT ENTRY POINT ══════════════════ */

// lance un combat
function doCombat(r1,c1,r2,c2,autoClose=false){
  showCombatModal(r1,c1,r2,c2,autoClose);
}