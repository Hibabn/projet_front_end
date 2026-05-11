/* ══ AUDIO CONTEXT ══ Web Audio API du navigateur */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
function getACtx(){ if(!_actx) _actx = new AudioCtx(); return _actx; }
