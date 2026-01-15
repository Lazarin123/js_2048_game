'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplay = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');
  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');
  const cells = document.querySelectorAll('.field-cell');

  const width = 4;
  let board = [];
  let score = 0;
  let isGameOver = false;

  // Inicializa a matriz do jogo
  function createBoard() {
    board = [];

    for (let i = 0; i < width * width; i++) {
      board.push(0);
    }
    addNumber();
    addNumber();
    updateDisplay();
  }

  // Adiciona um número aleatório (2 ou 4) em uma célula vazia
  function addNumber() {
    const emptyCells = board
      .map((val, index) => (val === 0 ? index : null))
      .filter((val) => val !== null);

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[randomCell] = Math.random() > 0.1 ? 2 : 4;
    }
  }

  // Atualiza o DOM com base no array 'board'
  function updateDisplay() {
    cells.forEach((cell, i) => {
      const value = board[i];

      cell.innerText = value === 0 ? '' : value;
      // Limpa classes de cores anteriores e adiciona a nova
      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
    scoreDisplay.innerHTML = score;
  }

  // Lógica de deslizar para a esquerda (base para todas as outras direções)
  function slide(row) {
    const arr = row.filter((val) => val); // Remove zeros
    const missing = width - arr.length;
    const zeros = Array(missing).fill(0);

    return arr.concat(zeros);
  }

  // Lógica de combinar números iguais
  function combine(row) {
    for (let i = 0; i < width - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        score += row[i];

        if (row[i] === 2048) {
          showWin();
        }
      }
    }

    return row;
  }

  function moveLeft() {
    let moved = false;

    for (let i = 0; i < width * width; i += width) {
      const row = board.slice(i, i + width);
      const newRow = slide(combine(slide(row)));

      if (JSON.stringify(row) !== JSON.stringify(newRow)) {
        moved = true;
      }
      board.splice(i, width, ...newRow);
    }

    return moved;
  }

  function moveRight() {
    let moved = false;

    for (let i = 0; i < width * width; i += width) {
      const row = board.slice(i, i + width).reverse();
      const newRow = slide(combine(slide(row))).reverse();

      if (
        JSON.stringify(board.slice(i, i + width)) !== JSON.stringify(newRow)
      ) {
        moved = true;
      }
      board.splice(i, width, ...newRow);
    }

    return moved;
  }

  function moveUp() {
    let moved = false;

    for (let i = 0; i < width; i++) {
      const column = [
        board[i],
        board[i + width],
        board[i + width * 2],
        board[i + width * 3],
      ];
      const newColumn = slide(combine(slide(column)));

      if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
        moved = true;
      }

      for (let j = 0; j < width; j++) {
        board[i + j * width] = newColumn[j];
      }
    }

    return moved;
  }

  function moveDown() {
    let moved = false;

    for (let i = 0; i < width; i++) {
      const column = [
        board[i],
        board[i + width],
        board[i + width * 2],
        board[i + width * 3],
      ].reverse();
      const newColumn = slide(combine(slide(column))).reverse();

      if (
        JSON.stringify([
          board[i],
          board[i + width],
          board[i + width * 2],
          board[i + width * 3],
        ]) !== JSON.stringify(newColumn)
      ) {
        moved = true;
      }

      for (let j = 0; j < width; j++) {
        board[i + j * width] = newColumn[j];
      }
    }

    return moved;
  }

  function control(e) {
    if (isGameOver) {
      return;
    }

    let moved = false;

    if (e.keyCode === 37 || e.key === 'ArrowLeft') {
      moved = moveLeft();
    } else if (e.keyCode === 38 || e.key === 'ArrowUp') {
      moved = moveUp();
    } else if (e.keyCode === 39 || e.key === 'ArrowRight') {
      moved = moveRight();
    } else if (e.keyCode === 40 || e.key === 'ArrowDown') {
      moved = moveDown();
    }

    if (moved) {
      addNumber();
      updateDisplay();
      checkGameOver();
    }
  }

  function checkGameOver() {
    // Se houver zeros, o jogo continua
    if (board.includes(0)) {
      return;
    }

    // Verifica se ainda existem combinações possíveis (horizontal e vertical)
    for (let i = 0; i < board.length; i++) {
      // Horizontal
      if (i % width < width - 1 && board[i] === board[i + 1]) {
        return;
      }

      // Vertical
      if (i < 12 && board[i] === board[i + width]) {
        return;
      }
    }

    showLose();
  }

  function showWin() {
    msgWin.classList.remove('hidden');
    isGameOver = true;
  }

  function showLose() {
    msgLose.classList.remove('hidden');
    isGameOver = true;
  }

  function startGame() {
    isGameOver = false;
    score = 0;
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    startButton.innerText = 'Restart';
    createBoard();
  }

  startButton.addEventListener('click', startGame);
  document.addEventListener('keydown', control);
});
