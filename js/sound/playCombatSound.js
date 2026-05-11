function playCombatSound(won){ // Fonction qui joue le son de combat
  try { // Évite les erreurs audio

    const ctx = getACtx(); // Récupère le contexte audio
    const t = ctx.currentTime; // Temps audio actuel

    [220, 330].forEach((freq, i) => { // Boucle sur deux fréquences pour effet d'épées

      const osc = ctx.createOscillator(); // Crée un oscillateur (générateur de son)
      const gain = ctx.createGain(); // Crée un contrôleur de volume

      osc.type = 'sawtooth'; // Type de son agressif/métallique

      osc.frequency.setValueAtTime(freq * (1 + Math.random() * 0.1), t + i * 0.04); // Fréquence légèrement aléatoire

      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.3); // Descend progressivement la fréquence

      gain.gain.setValueAtTime(0.28, t + i * 0.04); // Définit le volume initial

      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35); // Réduit progressivement le volume

      const dist = ctx.createWaveShaper(); // Crée un effet de distorsion

      const curve = new Float32Array(256); // Tableau pour la courbe de distorsion

      for(let k = 0; k < 256; k++) curve[k] = (k / 128 - 1) > 0 ? 1 : -1; // Génère une onde carrée

      dist.curve = curve; // Applique la courbe de distorsion

      osc.connect(dist); // Connecte oscillateur → distorsion
      dist.connect(gain); // Connecte distorsion → volume
      gain.connect(ctx.destination); // Connecte volume → haut-parleurs

      osc.start(t + i * 0.04); // Démarre le son
      osc.stop(t + 0.4); // Arrête le son après 0.4 sec
    });

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate); // Crée un buffer audio

    const data = buf.getChannelData(0); // Récupère les données audio du buffer

    for(let j = 0; j < data.length; j++) data[j] = (Math.random()*2-1) * Math.exp(-j/(data.length*0.2)); // Génère un bruit métallique

    const src = ctx.createBufferSource(); // Crée une source audio buffer
    src.buffer = buf; // Place le buffer dans la source

    const ng = ctx.createGain(); // Contrôle volume du bruit

    ng.gain.setValueAtTime(0.4, t); // Volume initial du bruit

    ng.gain.exponentialRampToValueAtTime(0.001, t+0.2); // Fade out du bruit

    const filt = ctx.createBiquadFilter(); // Crée un filtre audio

    filt.type = 'bandpass'; // Filtre passe-bande
    filt.frequency.value = 2500; // Fréquence du filtre

    src.connect(filt); // Connecte source → filtre
    filt.connect(ng); // Connecte filtre → volume
    ng.connect(ctx.destination); // Connecte volume → sortie audio

    src.start(t); // Lance le bruit

    setTimeout(()=>{ // Attend 200ms avant musique victoire/défaite

      try {

        const ctx2 = getACtx(); // Récupère contexte audio

        const notes = won ? [440, 554, 660] : [440, 370, 294]; // Notes victoire ou défaite

        notes.forEach((freq, i) => { // Boucle sur les notes

          const o = ctx2.createOscillator(); // Oscillateur pour la note
          const g = ctx2.createGain(); // Contrôle volume note

          o.type = 'triangle'; // Son plus doux

          o.frequency.value = freq; // Définit fréquence note

          g.gain.setValueAtTime(0.15, ctx2.currentTime + i*0.12); // Volume initial note

          g.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + i*0.12 + 0.2); // Fade out note

          o.connect(g); // Connecte oscillateur → volume
          g.connect(ctx2.destination); // Connecte volume → sortie audio

          o.start(ctx2.currentTime + i*0.12); // Démarre note

          o.stop(ctx2.currentTime + i*0.12 + 0.25); // Arrête note
        });

      } catch(e){} // Ignore erreurs audio

    }, 200); // Délai 200ms

  } catch(e){} // Ignore erreurs globales
}