// main.js
import { Game } from './modules/Game.class.js';

const game = new Game();
const gameBoard = document.getElementById('game-board');

function updateUI() {
    gameBoard.innerHTML = ''; // Limpa o board
    
    game.grid.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            
            // CORREÇÃO: Adicionando a classe em vez de substituir
            cell.classList.add('field-cell'); 
            if (value > 0) {
                cell.classList.add(`field-cell--${value}`);
                cell.textContent = value;
            }
            
            gameBoard.appendChild(cell);
        });
    });
    
    document.getElementById('score').textContent = game.score;
}

// CORREÇÃO: Usando event.key em vez de keyCode
window.addEventListener('keydown', (event) => {
    let moved = false;
    
    switch (event.key) {
        case 'ArrowUp':    moved = game.move('up'); break;
        case 'ArrowDown':  moved = game.move('down'); break;
        case 'ArrowLeft':  moved = game.move('left'); break;
        case 'ArrowRight': moved = game.move('right'); break;
    }

    if (moved) {
        game.addRandomTile();
        updateUI();
    }
});

// Inicializa a interface
updateUI();
