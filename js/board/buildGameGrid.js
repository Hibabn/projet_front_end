function buildGameGrid(){ // construit la grille du jeu

  const grid=document.getElementById('board'); // récupère le plateau

  grid.style.gridTemplateColumns=`repeat(${SIZE},var(--cell))`; // définit colonnes

  grid.innerHTML=''; // vide le plateau

  const cc=document.getElementById('col-coords'); // zone coordonnées colonnes

  cc.innerHTML='<div style="width:4px"></div>'; // espace vide début

  for(let c=0;c<SIZE;c++) cc.innerHTML+=`<div class="coord-lbl">${c}</div>`; // affiche colonnes

  const rn=document.getElementById('row-nums'); // zone numéros lignes

  rn.innerHTML=''; // vide lignes

  for(let r=0;r<SIZE;r++) rn.innerHTML+=`<div class="row-num">${r}</div>`; // affiche lignes

  for(let r=0;r<SIZE;r++) // boucle lignes
    for(let c=0;c<SIZE;c++){ // boucle colonnes

      const el=document.createElement('div'); // crée case

      el.className='cell'; // style case

      el.id=`c${r}_${c}`; // id unique case

      el.onclick=()=>handleClick(r,c); // clic sur case

      grid.appendChild(el); // ajoute case au plateau
    }
}