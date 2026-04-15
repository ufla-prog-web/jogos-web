'use strict';

/* GAME DATA */

const WORDS = [
  { id: 'tocar', word: 'TOCAR', number: 1, dir: 'H', row: 0, col: 0,
    clue: 'Fazer soar instrumento musical ou entrar em contato físico' },
  { id: 'manga', word: 'MANGA', number: 3, dir: 'H', row: 2, col: 0,
    clue: 'Fruta tropical amarela ou parte da roupa que cobre o braço' },
  { id: 'amora', word: 'AMORA', number: 4, dir: 'H', row: 4, col: 0,
    clue: 'Fruta pequena e escura, de sabor agridoce' },
  { id: 'tumba', word: 'TUMBA', number: 1, dir: 'V', row: 0, col: 0,
    clue: 'Sepultura; 3ª pessoa do singular do verbo tombar' },
  { id: 'canto', word: 'CANTO', number: 2, dir: 'V', row: 0, col: 2,
    clue: 'Extremidade de um cômodo; ato ou arte de cantar' },
];

const ROWS = 5, COLS = 5, MAX_ATT = 5;

/*
  Grid layout (5×5):
      col: 0  1  2  3  4
  row 0: [T][O][C][A][R]  ← TOCAR
  row 1: [O][·][A][·][·]  ← TUMBA[1], CANTO[1]
  row 2: [M][A][N][G][A]  ← MANGA
  row 3: [B][·][T][·][·]  ← TUMBA[3], CANTO[3]
  row 4: [A][M][O][R][A]  ← AMORA
  Black cells: (1,1)(1,3)(1,4)(3,1)(3,3)(3,4)
  Intersections: (0,0)T (0,2)C (2,0)M (2,2)N (4,0)A (4,2)O
*/

/* Precompute cell info */
const CELL_INFO = {}; // key '0-0' → { words: [...ids], number: null }

WORDS.forEach(w => {
  for (let i = 0; i < 5; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    const k = `${r}-${c}`;
    if (!CELL_INFO[k]) CELL_INFO[k] = { words: [], number: null };
    CELL_INFO[k].words.push(w.id);
  }
  const startKey = `${w.row}-${w.col}`;
  if (CELL_INFO[startKey].number === null) {
    CELL_INFO[startKey].number = w.number;
  }
});

/*GAME STATE*/

let S; // global state

function createState() {
  const ws = {};
  WORDS.forEach(w => {
    ws[w.id] = { attempts: [], input: '', solved: false, failed: false };
  });
  return {
    cur: null,          // currently selected word id
    ws,                 // word states
    revealed: {},       // '0-0' → letter (intersection reveals)
    keyColors: {},      // letter → 'correct'|'present'|'absent'
    animating: false,
    over: false,
  };
}

/* HELPERS*/

function wordDef(id)  { return WORDS.find(w => w.id === id); }
function wordState(id){ return S.ws[id]; }

function cellLetter(wordId, cellRow, cellCol) {
  const w = wordDef(wordId);
  const i = w.dir === 'H' ? cellCol - w.col : cellRow - w.row;
  return w.word[i];
}

/** Evaluate a 5-letter guess against answer (Wordle algorithm) */
function evaluate(guess, answer) {
  const res = Array(5).fill('absent');
  const ans = answer.split('');
  const gss = guess.split('');
  // Pass 1: greens
  for (let i = 0; i < 5; i++) {
    if (gss[i] === ans[i]) { res[i] = 'correct'; ans[i] = null; gss[i] = null; }
  }
  // Pass 2: yellows
  for (let i = 0; i < 5; i++) {
    if (gss[i] !== null) {
      const idx = ans.indexOf(gss[i]);
      if (idx !== -1) { res[i] = 'present'; ans[idx] = null; }
    }
  }
  return res;
}

/**
 * Build the full 5-letter guess string by merging typed input
 * with locked (revealed) positions. Returns null if incomplete.
 */
function buildFull(wid, input) {
  const w = wordDef(wid);
  let result = '', inputIdx = 0;
  for (let i = 0; i < 5; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    const k = `${r}-${c}`;
    if (S.revealed[k]) {
      result += S.revealed[k];
    } else {
      if (inputIdx >= input.length) return null;
      result += input[inputIdx++];
    }
  }
  return result;
}

/** Count non-locked positions in a word */
function freeCount(wid) {
  const w = wordDef(wid);
  let n = 0;
  for (let i = 0; i < 5; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    if (!S.revealed[`${r}-${c}`]) n++;
  }
  return n;
}

function isVictory() { return WORDS.every(w => S.ws[w.id].solved); }
function isAllDone()  { return WORDS.every(w => { const s = S.ws[w.id]; return s.solved || s.failed; }); }

function nextUnsolved() {
  // Try to pick the word with most revealed letters (makes game flow nicely)
  let best = null, bestRevealed = -1;
  for (const w of WORDS) {
    const ws = S.ws[w.id];
    if (ws.solved || ws.failed) continue;
    let cnt = 0;
    for (let i = 0; i < 5; i++) {
      const r = w.dir === 'H' ? w.row : w.row + i;
      const c = w.dir === 'H' ? w.col + i : w.col;
      if (S.revealed[`${r}-${c}`]) cnt++;
    }
    if (cnt > bestRevealed) { bestRevealed = cnt; best = w.id; }
  }
  return best;
}

/** Reveal all cells of a solved word */
function revealWord(wid) {
  const w = wordDef(wid);
  for (let i = 0; i < 5; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    S.revealed[`${r}-${c}`] = w.word[i];
  }
}

/** After a guess, reveal intersection cells where guess[i] is correct */
function revealIntersections(wid, fullGuess, result) {
  const w = wordDef(wid);
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') {
      const r = w.dir === 'H' ? w.row : w.row + i;
      const c = w.dir === 'H' ? w.col + i : w.col;
      const k = `${r}-${c}`;
      if (CELL_INFO[k] && CELL_INFO[k].words.length > 1) {
        S.revealed[k] = fullGuess[i];
      }
    }
  }
}

/* ACTIONS */

function selectWord(id) {
  if (!id || S.over) return;
  const ws = wordState(id);
  if (ws.solved || ws.failed) return;
  S.cur = id;
  render();
}

function addLetter(letter) {
  if (!S.cur || S.animating || S.over) return;
  const ws = wordState(S.cur);
  if (ws.solved || ws.failed) return;
  if (ws.input.length >= freeCount(S.cur)) return;
  ws.input += letter.toUpperCase();
  renderGuessPanel();
}

function deleteLetter() {
  if (!S.cur || S.animating || S.over) return;
  const ws = wordState(S.cur);
  if (ws.solved || ws.failed || ws.input.length === 0) return;
  ws.input = ws.input.slice(0, -1);
  renderGuessPanel();
}

function submitGuess() {
  if (!S.cur || S.animating || S.over) return;
  const ws  = wordState(S.cur);
  const wdef = wordDef(S.cur);
  if (ws.solved || ws.failed) return;

  const full = buildFull(S.cur, ws.input);
  if (!full) {
    shakeRow(ws.attempts.length);
    showToast('Complete todas as letras! 📝');
    return;
  }

  const result = evaluate(full, wdef.word);
  const attempt = full.split('').map((l, i) => ({ letter: l, state: result[i] }));
  ws.attempts.push(attempt);
  ws.input = '';

  // Update key colors (green > yellow > gray priority)
  const prio = { correct: 3, present: 2, absent: 1 };
  result.forEach((st, i) => {
    const l = full[i];
    if (!S.keyColors[l] || prio[st] > prio[S.keyColors[l]]) S.keyColors[l] = st;
  });

  const isSolved = result.every(s => s === 'correct');

  // Show flip animation, THEN process result
  S.animating = true;
  renderGuessPanel(true); // pass flag = this row should animate

  setTimeout(() => {
    S.animating = false;

    if (isSolved) {
      ws.solved = true;
      revealWord(S.cur);
      showToast('Excelente! Palavra encontrada! 🎉');
      render();
      if (isVictory()) {
        setTimeout(() => showEndModal(true), 600);
      } else {
        setTimeout(() => { selectWord(nextUnsolved()); }, 800);
      }
    } else {
      // Reveal intersection cells for correct letters
      revealIntersections(S.cur, full, result);

      if (ws.attempts.length >= MAX_ATT) {
        ws.failed = true;
        showToast(`A palavra era: ${wdef.word}`);
        render();
        if (isAllDone()) {
          setTimeout(() => showEndModal(isVictory()), 700);
        } else {
          setTimeout(() => { selectWord(nextUnsolved()); }, 900);
        }
      } else {
        render();
        // Hint about intersections
        const newReveals = result.filter((s,i) => {
          const w = wdef;
          const r = w.dir === 'H' ? w.row : w.row + i;
          const c = w.dir === 'H' ? w.col + i : w.col;
          const k = `${r}-${c}`;
          return s === 'correct' && CELL_INFO[k] && CELL_INFO[k].words.length > 1;
        }).length;
        if (newReveals > 0) {
          setTimeout(() => showToast(`${newReveals} cruzamento(s) revelado(s)! 🔀`), 300);
        }
      }
    }
  }, 420 + 80 * 4 + 100); // wait for all flips to complete
}

/* RENDER */

function render() {
  renderGrid();
  //renderClues();
  renderGuessPanel();
  renderProgress();
}

/* ---- GRID ---- */
function renderGrid() {
  const el = document.getElementById('crossword-grid');
  el.innerHTML = '';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const k = `${r}-${c}`;
      const info = CELL_INFO[k];
      const div = document.createElement('div');
      div.className = 'cell';
      div.id = `cell-${r}-${c}`;

      if (!info) {
        div.classList.add('black');
      } else {
        div.classList.add('word');

        // Highlight if part of current word
        if (S.cur && info.words.includes(S.cur)) div.classList.add('sel');

        // Number label
        if (info.number !== null) {
          const num = document.createElement('span');
          num.className = 'cell-num';
          num.textContent = info.number;
          div.appendChild(num);
        }

        // Letter
        const lsp = document.createElement('span');
        lsp.className = 'cell-letter';
        let letter = null, cls = '';

        // Revealed by intersection
        if (S.revealed[k]) { letter = S.revealed[k]; cls = 'revealed'; }

        // If any word here is solved or failed, show letter
        for (const wid of info.words) {
          const ws = S.ws[wid];
          if (ws.solved || ws.failed) {
            letter = cellLetter(wid, r, c);
            cls = ws.solved ? 'solved-all' : 'failed-all';
            break;
          }
        }

        if (letter) {
          lsp.textContent = letter;
          div.classList.add(cls);
          if (cls === 'revealed') {
            // Check if this was JUST revealed (animate)
            if (!div.classList.contains('pop-in')) div.classList.add('pop-in');
          }
        }

        div.appendChild(lsp);
        div.addEventListener('click', () => handleCellClick(r, c, info.words));
      }

      el.appendChild(div);
    }
  }
}

function handleCellClick(r, c, wordIds) {
  const unsolved = wordIds.filter(id => !S.ws[id].solved && !S.ws[id].failed);
  if (unsolved.length === 0) return;
  if (unsolved.length === 1) { selectWord(unsolved[0]); return; }
  // Multiple unsolved words at this cell: cycle through them
  const cur = unsolved.indexOf(S.cur);
  selectWord(unsolved[(cur + 1) % unsolved.length]);
}


/* ---- GUESS PANEL ---- */
function renderGuessPanel(animateLastRow = false) {
  const labelEl   = document.getElementById('word-label');
  const counterEl = document.getElementById('att-counter');
  const wrapEl    = document.getElementById('attempts-wrap');
  

  if (!S.cur) {
    labelEl.textContent = 'Selecione uma palavra →';
    counterEl.textContent = '';
    wrapEl.innerHTML = '<div style="text-align:center;color:var(--text-dim);font-size:.78rem;padding:14px 0;line-height:1.6">Clique em uma célula do tabuleiro</div>';
    return;
  }

  const wdef = wordDef(S.cur);
  const ws   = wordState(S.cur);


  labelEl.textContent = `Palavra ${wdef.number}${wdef.dir === 'H' ? '→' : '↓'}`;
  counterEl.textContent = `${ws.attempts.length}/${MAX_ATT}`;

  // Build attempt rows
  wrapEl.innerHTML = '';
  for (let i = 0; i < MAX_ATT; i++) {
    const row = document.createElement('div');
    row.className = 'att-row';
    row.id = `att-row-${i}`;

    if (i < ws.attempts.length) {
      // Completed attempt
      const att = ws.attempts[i];
      const isLast = (i === ws.attempts.length - 1) && animateLastRow;
      att.forEach((item, j) => {
        const cell = document.createElement('div');
        cell.className = `att-cell ${item.state}`;
        cell.textContent = item.letter;
        if (isLast) {
          cell.classList.add('flip');
          cell.style.animationDelay = `${j * 80}ms`;
        }
        row.appendChild(cell);
      });
    } else if (i === ws.attempts.length && !ws.solved && !ws.failed) {
      // Current input row
      let inputIdx = 0, cursorPlaced = false;
      for (let j = 0; j < 5; j++) {
        const r = wdef.dir === 'H' ? wdef.row : wdef.row + j;
        const c = wdef.dir === 'H' ? wdef.col + j : wdef.col;
        const k = `${r}-${c}`;
        const cell = document.createElement('div');
        cell.className = 'att-cell';

        if (S.revealed[k]) {
          cell.textContent = S.revealed[k];
          cell.classList.add('locked');
        } else {
          if (inputIdx < ws.input.length) {
            cell.textContent = ws.input[inputIdx];
            cell.classList.add('filled');
          } else if (!cursorPlaced) {
            cell.classList.add('cursor');
            cursorPlaced = true;
          }
          inputIdx++;
        }
        row.appendChild(cell);
      }
    } else {
      // Empty future row
      for (let j = 0; j < 5; j++) {
        const cell = document.createElement('div');
        cell.className = 'att-cell';
        row.appendChild(cell);
      }
    }

    wrapEl.appendChild(row);
  }
}


/* UI HELPERS */

let toastTimer = null;
function showToast(msg, duration = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

function shakeRow(idx) {
  const row = document.getElementById(`att-row-${idx}`);
  if (!row) return;
  row.classList.remove('shake');
  void row.offsetWidth; // reflow
  row.classList.add('shake');
}

function showEndModal(win) {
  S.over = true;
  const overlay  = document.getElementById('modal-overlay');
  const emojiEl  = document.getElementById('modal-emoji');
  const titleEl  = document.getElementById('modal-title');
  const descEl   = document.getElementById('modal-desc');
  const wordsEl  = document.getElementById('modal-words');

  emojiEl.textContent = win ? '🏆' : '💡';
  titleEl.textContent = win ? 'PARABÉNS!' : 'FIM DE JOGO';
  titleEl.className   = `modal-title ${win ? 'win' : 'lose'}`;

  const solved = WORDS.filter(w => S.ws[w.id].solved).length;
  descEl.textContent = win
    ? `Você resolveu todas as ${WORDS.length} palavras do crucigrama!`
    : `Você resolveu ${solved} de ${WORDS.length} palavras.`;

  wordsEl.innerHTML = '';
  WORDS.forEach(w => {
    const ws = S.ws[w.id];
    const row = document.createElement('div');
    row.className = `modal-word-row ${ws.solved ? 'wsolved' : 'wfailed'}`;
    row.innerHTML = `
      <span class="wlabel">${w.number}${w.dir === 'H' ? '→' : '↓'}</span>
      <span class="wword">${w.word}</span>
      <span class="wicon">${ws.solved ? '✓' : '✗'}</span>
    `;
    wordsEl.appendChild(row);
  });

  overlay.classList.add('open');
}

function restartGame() {
  document.getElementById('modal-overlay').classList.remove('open');
  S = createState();
  render();
  setTimeout(() => selectWord(WORDS[0].id), 100);
}

function closeHelp() {
  document.getElementById('help-overlay').classList.remove('open');
}

/* KEYBOARD INPUT */

document.addEventListener('keydown', e => {
  if (S.over || S.animating) return;
  // Don't capture if modal open
  if (document.getElementById('help-overlay').classList.contains('open')) return;
  if (document.getElementById('modal-overlay').classList.contains('open')) return;

  const key = e.key;
  if (key === 'Enter') { e.preventDefault(); submitGuess(); }
  else if (key === 'Backspace') { e.preventDefault(); deleteLetter(); }
  else if (/^[a-zA-Z]$/.test(key)) { addLetter(key); }
  // Arrow keys to switch between words
  else if (key === 'Tab') {
    e.preventDefault();
    const ids = WORDS.map(w => w.id).filter(id => !S.ws[id].solved && !S.ws[id].failed);
    if (ids.length === 0) return;
    const cur = ids.indexOf(S.cur);
    const next = (cur + (e.shiftKey ? -1 + ids.length : 1)) % ids.length;
    selectWord(ids[next]);
  }
});

/* HELP BUTTON */

document.getElementById('btn-help').addEventListener('click', () => {
  document.getElementById('help-overlay').classList.add('open');
});

document.getElementById('help-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('help-overlay')) closeHelp();
});

/* INIT */

S = createState();
render();
// Auto-select first word with a short delay for effect
setTimeout(() => selectWord(WORDS[0].id), 200);
