/* ══════════════════ GAME GRID ══════════════════ */
function buildGameGrid(){
  const grid=document.getElementById('board');
  grid.style.gridTemplateColumns=`repeat(${SIZE},var(--cell))`;
  grid.innerHTML='';
  const cc=document.getElementById('col-coords');cc.innerHTML='<div style="width:4px"></div>';
  for(let c=0;c<SIZE;c++)cc.innerHTML+=`<div class="coord-lbl">${c}</div>`;
  const rn=document.getElementById('row-nums');rn.innerHTML='';
  for(let r=0;r<SIZE;r++)rn.innerHTML+=`<div class="row-num">${r}</div>`;
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){
    const el=document.createElement('div');el.className='cell';el.id=`c${r}_${c}`;
    el.onclick=()=>handleClick(r,c);grid.appendChild(el);
  }
}