(function () {
  "use strict";

  // 8 frutas, cada uma duas vezes = 16 cartas
  var SYMBOLS = ["🍎", "🍌", "🍇", "🍊", "🍋", "🍉", "🍓", "🥝"];
  var PAIR_COUNT = SYMBOLS.length;

  var boardEl = document.getElementById("board");
  var movesEl = document.getElementById("moves");
  var pairsEl = document.getElementById("pairs");
  var timerEl = document.getElementById("timer");
  var btnNew = document.getElementById("btn-new");
  var overlayWin = document.getElementById("overlay-win");
  var winStats = document.getElementById("win-stats");
  var btnPlayAgain = document.getElementById("btn-play-again");

  var state = {
    cards: [],
    flipped: [],
    moves: 0,
    matchedPairs: 0,
    lock: false,
    started: false,
    startTime: null,
    timerId: null,
    won: false,
  };

  function shuffle(array) {
    var a = array.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function tickTimer() {
    if (!state.startTime) return;
    var sec = Math.floor((Date.now() - state.startTime) / 1000);
    timerEl.textContent = formatTime(sec);
  }

  function startTimer() {
    if (state.started) return;
    state.started = true;
    state.startTime = Date.now();
    state.timerId = setInterval(tickTimer, 500);
    tickTimer();
  }

  function updateHud() {
    movesEl.textContent = String(state.moves);
    pairsEl.textContent = state.matchedPairs + " / " + PAIR_COUNT;
  }

  function buildCard(symbol, index) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.setAttribute("aria-label", "Carta virada para baixo");
    btn.dataset.index = String(index);

    var back = document.createElement("span");
    back.className = "card-face card-back";
    back.setAttribute("aria-hidden", "true");

    var front = document.createElement("span");
    front.className = "card-face card-front";
    front.textContent = symbol;
    front.setAttribute("aria-hidden", "true");

    btn.appendChild(back);
    btn.appendChild(front);

    btn.addEventListener("click", function () {
      onCardClick(index);
    });

    return btn;
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    for (var i = 0; i < state.cards.length; i++) {
      boardEl.appendChild(buildCard(state.cards[i].symbol, i));
    }
  }

  function getCardButton(index) {
    return boardEl.querySelector('.card[data-index="' + index + '"]');
  }

  function flipVisual(index, flipped) {
    var btn = getCardButton(index);
    if (!btn) return;
    btn.classList.toggle("flipped", flipped);
    btn.setAttribute(
      "aria-label",
      flipped ? "Carta aberta: " + state.cards[index].symbol : "Carta virada para baixo"
    );
  }

  function onCardClick(index) {
    if (state.lock || state.won) return;
    var card = state.cards[index];
    if (card.matched || card.flipped) return;

    startTimer();

    card.flipped = true;
    flipVisual(index, true);
    state.flipped.push(index);

    if (state.flipped.length < 2) return;

    state.lock = true;
    state.moves++;
    updateHud();

    var i0 = state.flipped[0];
    var i1 = state.flipped[1];
    var ok = state.cards[i0].symbol === state.cards[i1].symbol;

    if (ok) {
      state.cards[i0].matched = true;
      state.cards[i1].matched = true;
      getCardButton(i0).classList.add("matched");
      getCardButton(i1).classList.add("matched");
      state.matchedPairs++;
      updateHud();
      state.flipped = [];
      state.lock = false;

      if (state.matchedPairs === PAIR_COUNT) {
        state.won = true;
        stopTimer();
        var t = Math.floor((Date.now() - state.startTime) / 1000);
        winStats.textContent =
          "Acabou em " + state.moves + " jogadas, tempo " + formatTime(t) + ".";
        overlayWin.classList.remove("hidden");
      }
    } else {
      window.setTimeout(function () {
        state.cards[i0].flipped = false;
        state.cards[i1].flipped = false;
        flipVisual(i0, false);
        flipVisual(i1, false);
        state.flipped = [];
        state.lock = false;
      }, 700);
    }
  }

  function newGame() {
    stopTimer();
    var deck = shuffle(SYMBOLS.concat(SYMBOLS));
    var cards = [];
    for (var k = 0; k < deck.length; k++) {
      cards.push({ symbol: deck[k], flipped: false, matched: false });
    }
    state = {
      cards: cards,
      flipped: [],
      moves: 0,
      matchedPairs: 0,
      lock: false,
      started: false,
      startTime: null,
      timerId: null,
      won: false,
    };
    overlayWin.classList.add("hidden");
    timerEl.textContent = "0:00";
    updateHud();
    renderBoard();
  }

  btnNew.addEventListener("click", newGame);
  btnPlayAgain.addEventListener("click", newGame);

  newGame();
})();
