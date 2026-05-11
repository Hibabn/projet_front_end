function playDiceSound(){ // Fonction qui joue le son du dé
  try { // Évite erreurs audio

    const ctx = getACtx(); // Récupère le contexte audio

    const clicks = [0, 0.06, 0.12, 0.18, 0.26, 0.34, 0.42, 0.52, 0.60]; // Temps des petits clics

    clicks.forEach((t, i) => { // Boucle sur chaque clic

      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate); // Crée buffer audio court

      const data = buf.getChannelData(0); // Récupère données audio du buffer

      for(let j = 0; j < data.length; j++){ // Boucle sur chaque sample audio

        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (data.length * 0.3)); // Génère bruit qui disparaît vite
      }

      const src = ctx.createBufferSource(); // Crée source audio

      src.buffer = buf; // Place buffer dans source

      const gain = ctx.createGain(); // Contrôle volume

      const vol = i === clicks.length - 1 ? 0.35 : 0.18; // Dernier clic plus fort

      gain.gain.setValueAtTime(vol, ctx.currentTime + t); // Définit volume initial

      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.08); // Fade out rapide

      const filt = ctx.createBiquadFilter(); // Crée filtre audio

      filt.type = 'highpass'; // Garde fréquences aiguës

      filt.frequency.value = i === clicks.length - 1 ? 900 : 600; // Dernier clic plus aigu

      src.connect(filt); // Connecte source → filtre
      filt.connect(gain); // Connecte filtre → volume
      gain.connect(ctx.destination); // Connecte volume → haut-parleurs

      src.start(ctx.currentTime + t); // Lance le clic audio
    });

    const osc = ctx.createOscillator(); // Crée oscillateur pour impact final

    const g2 = ctx.createGain(); // Contrôle volume impact final

    osc.type = 'sine'; // Son doux/grave

    osc.frequency.setValueAtTime(180, ctx.currentTime + 0.60); // Fréquence initiale

    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.75); // Descend fréquence progressivement

    g2.gain.setValueAtTime(0.22, ctx.currentTime + 0.60); // Volume initial impact

    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.80); // Fade out impact

    osc.connect(g2); // Connecte oscillateur → volume

    g2.connect(ctx.destination); // Connecte volume → haut-parleurs

    osc.start(ctx.currentTime + 0.60); // Lance impact final

    osc.stop(ctx.currentTime + 0.85); // Arrête impact final

  } catch(e){} // Ignore erreurs audio
}