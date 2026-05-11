/* ══════════════════ COMBAT DICE MODAL CONTROLLER ══════════════════ */
let _combatPending = null; // stores resolved combat data for when modal is closed

function showCombatModal(r1,c1,r2,c2,autoClose=false){
  const aUnit=board[r1][c1].unit, dUnit=board[r2][c2].unit;
  const ab=board[r1][c1].bonusBuff?1:0, db=board[r2][c2].bonusBuff?1:0;
  const defendBonus=board[r2][c2].defending?2:0;
  const ad=Math.ceil(Math.random()*6), dd=Math.ceil(Math.random()*6);
  const aBase=UNITS[aUnit].power, dBase=UNITS[dUnit].power;
  const aTotal=aBase+ad+ab, dTotal=dBase+dd+db+defendBonus;
  const an=currentPlayer===1?CFG.p1:CFG.p2, dn=currentPlayer===1?CFG.p2:CFG.p1;

  // Determine winner
  let attackerWins, resultMsg, resultClass;
  if(aTotal!==dTotal){
    attackerWins=aTotal>dTotal;
  } else {
    let ts1=0,ts2=0;
    for(let rr=0;rr<SIZE;rr++)for(let cc=0;cc<SIZE;cc++){if(board[rr][cc].owner===1)ts1++;if(board[rr][cc].owner===2)ts2++;}
    const aScore=(currentPlayer===1?ts1:ts2)+killPoints[currentPlayer];
    const dPlayer=currentPlayer===1?2:1;
    const dScore=(dPlayer===1?ts1:ts2)+killPoints[dPlayer];
    if(aScore>dScore){attackerWins=true;}
    else if(dScore>aScore){attackerWins=false;}
    else{attackerWins=false;}
  }

  if(aTotal===dTotal){
    resultMsg=`⚖ Égalité ! Avantage défenseur — ${dn} résiste.`;
    resultClass='draw';
  } else if(attackerWins){
    resultMsg=`✿ ${an} remporte le combat !`;
    resultClass='p1-win';
  } else {
    resultMsg=`💀 ${dn} défend avec succès ! ${an} est éliminé.`;
    resultClass='p2-win';
  }

  _combatPending={r1,c1,r2,c2,aUnit,dUnit,ab,db,defendBonus,ad,dd,aBase,dBase,aTotal,dTotal,an,dn,attackerWins,resultMsg,resultClass,isAI:autoClose};

  // Fill modal
  document.getElementById('cm-subtitle').textContent='Les dés décident du sort…';
  // attacker side — always use player colors correctly
  const atkIsP1 = currentPlayer===1;
  document.getElementById('cm-atk-name').textContent=an;
  document.getElementById('cm-atk-name').className='cm-fighter-name '+(atkIsP1?'p1':'p2');
  document.getElementById('cm-atk-icon').className='cm-unit-icon '+(atkIsP1?'p1':'p2');
  document.getElementById('cm-atk-icon').innerHTML=`<svg width="36" height="36">${pieceSVG(aUnit,currentPlayer).replace(/<svg[^>]*>/,'').replace('</svg>','')}</svg>`;
  document.getElementById('cm-atk-unit').textContent=UNITS[aUnit].label+(ab?' ✦':'');
  document.getElementById('cm-def-name').textContent=dn;
  document.getElementById('cm-def-name').className='cm-fighter-name '+(atkIsP1?'p2':'p1');
  document.getElementById('cm-def-icon').className='cm-unit-icon '+(atkIsP1?'p2':'p1');
  const defPlayer=currentPlayer===1?2:1;
  document.getElementById('cm-def-icon').innerHTML=`<svg width="36" height="36">${pieceSVG(dUnit,defPlayer).replace(/<svg[^>]*>/,'').replace('</svg>','')}</svg>`;
  document.getElementById('cm-def-unit').textContent=UNITS[dUnit].label+(db?' ✦':'')+(defendBonus?' 🛡':'');

  // Reset dice & scores
  const dieAtk=document.getElementById('cm-die-atk');
  const dieDef=document.getElementById('cm-die-def');
  dieAtk.textContent='?'; dieAtk.className='cm-die '+(atkIsP1?'p1-die':'p2-die');
  dieDef.textContent='?'; dieDef.className='cm-die '+(atkIsP1?'p2-die':'p1-die');
  document.getElementById('cm-formula-atk').textContent='';
  document.getElementById('cm-formula-def').textContent='';
  document.getElementById('cm-total-atk').textContent='—';
  document.getElementById('cm-total-atk').className='cm-score-total p1';
  document.getElementById('cm-total-def').textContent='—';
  document.getElementById('cm-total-def').className='cm-score-total p2';
  const res=document.getElementById('cm-result');
  res.className='cm-result'; res.textContent='';
  const closeBtn=document.getElementById('cm-close-btn');
  closeBtn.className='cm-close-btn';

  // Show backdrop
  document.getElementById('combat-backdrop').classList.add('open');

  // Phase 1: both dice roll (shake animation + sound)
  playDiceSound();
  dieAtk.classList.add('rolling');
  dieDef.classList.add('rolling');

  // Shuffle faces during roll
  const faces='123456';
  let shuffleCount=0;
  const shuffleInterval=setInterval(()=>{
    dieAtk.textContent=faces[Math.floor(Math.random()*6)];
    dieDef.textContent=faces[Math.floor(Math.random()*6)];
    shuffleCount++;
    if(shuffleCount>=10){ clearInterval(shuffleInterval); }
  },60);

  // Phase 2: land attacker die after 700ms
  setTimeout(()=>{
    dieAtk.classList.remove('rolling');
    dieAtk.textContent=ad;
    dieAtk.classList.add('landed');
    playDiceSound();
    setTimeout(()=>dieAtk.classList.remove('landed'),400);

    // Show attacker formula
    setTimeout(()=>{
      let fAtk=`dé(${ad}) + force(${aBase})`;
      if(ab) fAtk+=` + bonus(1)`;
      document.getElementById('cm-formula-atk').textContent=fAtk;
      document.getElementById('cm-total-atk').textContent=aTotal;
    },200);

    // Phase 3: land defender die after 400ms more
    setTimeout(()=>{
      dieDef.classList.remove('rolling');
      dieDef.textContent=dd;
      dieDef.classList.add('landed');
      playDiceSound();
      setTimeout(()=>dieDef.classList.remove('landed'),400);

      setTimeout(()=>{
        let fDef=`dé(${dd}) + force(${dBase})`;
        if(db) fDef+=` + bonus(1)`;
        if(defendBonus) fDef+=` + défense(2)`;
        document.getElementById('cm-formula-def').textContent=fDef;
        document.getElementById('cm-total-def').textContent=dTotal;

        // Phase 4: highlight winner, show result
        setTimeout(()=>{
          if(aTotal>dTotal){
            document.getElementById('cm-total-atk').classList.add('winner');
          } else if(dTotal>aTotal){
            document.getElementById('cm-total-def').classList.add('winner');
          }
          res.className='cm-result show '+resultClass;
          res.textContent=resultMsg;
          document.getElementById('cm-subtitle').textContent=aTotal===dTotal?'Égalité — départage par score':'Les dés ont parlé !';
          closeBtn.classList.add('show');
          if(autoClose) setTimeout(()=>closeCombatModal(), 1800);
        },350);
      },200);
    },500);
  },700);
}

function closeCombatModal(){
  document.getElementById('combat-backdrop').classList.remove('open');
  if(!_combatPending) return;
  const{r1,c1,r2,c2,aUnit,dUnit,ab,db,defendBonus,ad,dd,aBase,dBase,aTotal,dTotal,an,dn,attackerWins,isAI}=_combatPending;
  _combatPending=null;

  const aColor=currentPlayer===1?'#e8588a':'#9b5de5';

  // Log
  addLog(`⚔ ${an} (${UNITS[aUnit].label}) VS ${dn} (${UNITS[dUnit].label})`,'combat');
  addLog(`  ${an} : dé(${ad}) + force(${aBase})${ab?' + 1 bonus':''} = ${aTotal}`,'combat-detail');
  addLog(`  ${dn} : dé(${dd}) + force(${dBase})${db?' + 1 bonus':''}${defendBonus?' + 2 défense':''} = ${dTotal}${defendBonus?' 🛡':''}`,'combat-detail');

  animatePiece(r1,c1,'anim-attack',500);

  if(attackerWins){
    const kpts=UNITS[dUnit].killPts; killPoints[currentPlayer]+=kpts;
    addLog(`✿ Victoire ${an} ! +${kpts} pts kill [${aTotal}>${dTotal}]`,'kill');
    playCombatSound(true);
    animatePiece(r2,c2,'anim-die',600);
    const dstPt=getCellCenter(r2,c2);
    const killColor=dUnit==='T'?'#f4a261':dUnit==='C'?'#c090f0':'#e8588a';
    spawnParticles(dstPt.x,dstPt.y,killColor,20,true);
    shakeBoard();
    const killLabel={T:'💥 TANK DÉTRUIT !',C:'⚡ CAVALIER ABATTU !',S:'💀 SOLDAT ÉLIMINÉ !'}[dUnit];
    spawnKillBanner(killLabel);
    setTimeout(()=>{
      board[r1][c1].bonusBuff=false;
      board[r1][c1].defending=false;
      doMove(r1,c1,r2,c2);
      checkWin(); renderBoard();
      if(!isAI) endTurn();
    },350);
  } else {
    if(aTotal===dTotal){addLog(`⚖ Égalité → avantage défenseur ${dn}`,'combat');}
    addLog(`💀 ${an} perd. ${UNITS[aUnit].label} détruit [${aTotal}≤${dTotal}]`,'warn');
    playCombatSound(false);
    animatePiece(r1,c1,'anim-die',600);
    const srcPt=getCellCenter(r1,c1);
    spawnParticles(srcPt.x,srcPt.y,aColor,14,true);
    if(aUnit==='T'){shakeBoard();}
    board[r1][c1].bonusBuff=false;
    board[r2][c2].bonusBuff=false;
    board[r1][c1].unit=null; board[r1][c1].player=0;
    checkWin();
    updateMoveUI();
    renderBoard();
    if(!isAI) endTurn();
  }
}

/* ══════════════════ COMBAT ══════════════════ */
function doCombat(r1,c1,r2,c2,autoClose=false){
  showCombatModal(r1,c1,r2,c2,autoClose);
}