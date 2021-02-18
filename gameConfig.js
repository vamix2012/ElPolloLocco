// ******************* Game config ****************** \\
let JUMP_TIME = 300; //in ms 
let GAME_SPEED = 6;
let BOSS_POSITION = 5000;
let AUDIO_RUNNING = new Audio('audio/running.mp3');
let AUDIO_JUMP = new Audio('audio/jump.mp3');
let AUDIO_BOTTLE = new Audio('audio/bottle.mp3');
let AUDIO_THROW = new Audio('audio/throw.mp3');
let AUDIO_CHICKEN = new Audio('audio/chicken.mp3');
let AUDIO_GLASS = new Audio('audio/glass.mp3');
let AUDIO_WIN = new Audio('audio/win.mp3')
let AUDIO_BGM = new Audio('audio/bgm.mp3');
let AUDIO_HIT = new Audio('audio/scream.wav');
let AUDIO_OVER = new Audio('audio/game_over.mp3')
let AUDIO_START = new Audio('audio/el_pollo_loco.mp3');
AUDIO_BGM.loop = true;
AUDIO_BGM.volume = 0.1;
AUDIO_START.volume = 0.1;