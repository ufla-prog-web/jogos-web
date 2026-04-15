const rows = 20;
const cols = 10;
const board = [];

const game = document.getElementById("game");
const comboElement = document.getElementById("combo");
const scoreElement = document.getElementById("score");

const startBackground = document.getElementById("start-bg");
const pausedBackground = document.getElementById("paused-bg");
const gameOverBackground = document.getElementById("game-over-bg");

const pausedModal = document.getElementById("paused");
const startModal = document.getElementById("start");
const gameOverModal = document.getElementById("game-over");

const startButton = document.getElementById("start-button");
const landingPage = document.getElementById("landing");
const mainPage = document.querySelector("main");
const rankingList = document.getElementById("ranking-list");
const rankingTitle = document.getElementById("ranking-title");

const basePoints = [0, 10, 30, 50, 80];

let nextPiece = null;
let movingPiece = null;
let paused = true;
let started = false;
let gameOver = false;
let score = 0;
let combo = 0;
let dropInterval = 500;
let lastDropTime = 0;
let level = 1;
let totalLinesCleared = 0;