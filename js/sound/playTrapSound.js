function playTrapSound(){ // Fonction qui joue le son d’un piège
  try { // Évite les erreurs audio

    const ctx = getACtx(); // Récupère le contexte audio
    const t = ctx.currentTime; // Temps actuel audio

    // Son principal : chute dramatique
    const osc = ctx.createOscillator(); // Oscillateur principal (son)
    const gain = ctx.createGain(); // Contrôle volume

    osc.type = 'sawtooth'; // Son agressif/métallique

    osc.frequency.setValueAtTime(600, t); // Fréquence de départ élevée

    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5); // Descente rapide du son (effet chute)

    gain.gain.setValueAtTime(0.4, t); // Volume initial

    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55); // Fade out du son

    osc.connect(gain); // Oscillateur → volume
    gain.connect(ctx.destination); // Volume → haut-parleurs

    osc.start(t); // Démarre le son
    osc.stop(t + 0.6); // Arrête le son

    // Bruit de "snap" (piège qui se déclenche)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate); // Buffer court bruit

    const data = buf.getChannelData(0); // Données audio

    for(let j = 0; j < data.length; j++)
      data[j] = (Math.random()*2-1) * Math.exp(-j/(data.length*0.15)); // Bruit + décroissance rapide

    const src = ctx.createBufferSource(); // Source audio du buffer
    src.buffer = buf; // Ajoute le bruit

    const ng = ctx.createGain(); // Volume du bruit
    ng.gain.setValueAtTime(0.5, t); // Volume initial fort

    const filt = ctx.createBiquadFilter(); // Filtre audio
    filt.type = 'highpass'; // Garde seulement sons aigus
    filt.frequency.value = 800; // Coupe les basses

    src.connect(filt); // Bruit → filtre
    filt.connect(ng); // Filtre → volume
    ng.connect(ctx.destination); // Volume → haut-parleurs

    src.start(t); // Lance bruit de piège

    // Rumble grave (effet tension)
    const osc2 = ctx.createOscillator(); // Deuxième oscillateur
    const g2 = ctx.createGain(); // Volume du rumble

    osc2.type = 'sine'; // Son doux/grave

    osc2.frequency.setValueAtTime(60, t+0.05); // Fréquence grave initiale

    osc2.frequency.exponentialRampToValueAtTime(30, t+0.5); // Devient encore plus grave

    g2.gain.setValueAtTime(0.35, t+0.05); // Volume initial

    g2.gain.exponentialRampToValueAtTime(0.001, t+0.55); // Fade out

    osc2.connect(g2); // Oscillateur → volume
    g2.connect(ctx.destination); // Volume → haut-parleurs

    osc2.start(t+0.05); // Démarre rumble
    osc2.stop(t+0.6); // Arrête rumble

  } catch(e){} // Ignore erreurs audio
}