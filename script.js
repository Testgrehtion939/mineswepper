document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const numMines = 20;
    const gameBoard = document.getElementById('game-board');
    let cells = [];
    let minePositions = new Set();
    let gameOver = false;

    // 生成雷区
    function createBoard() {
        gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleClick);
            cells.push(cell);
            gameBoard.appendChild(cell);
        }
        placeMines();
    }

    // 随机放置地雷
    function placeMines() {
        while (minePositions.size < numMines) {
            let index = Math.floor(Math.random() * cells.length);
            if (!minePositions.has(index)) {
                minePositions.add(index);
                cells[index].classList.add('mine');
            }
        }
    }

    // 处理点击事件
    function handleClick(e) {
        if (gameOver) return;
        const cell = e.target;
        const index = parseInt(cell.dataset.index);
        if (cell.classList.contains('mine')) {
            cell.style.backgroundColor = 'red';
            gameOver = true;
            alert('Game Over!');
            revealAllMines();
        } else {
            const mineCount = countAdjacentMines(index);
            cell.textContent = mineCount || '';
            cell.style.backgroundColor = 'lightgray';
            cell.removeEventListener('click', handleClick); // 防止重复点击
            if (mineCount === 0) {
                revealAdjacentCells(index);
            }
        }
    }

    // 计算周围的雷数
    function countAdjacentMines(index) {
        const adjacentIndices = getAdjacentIndices(index);
        return adjacentIndices.filter(i => minePositions.has(i)).length;
    }

    // 获取周围的索引
    function getAdjacentIndices(index) {
        const adjacentIndices = [];
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;

        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                const newRow = row + r;
                const newCol = col + c;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    adjacentIndices.push(newRow * boardSize + newCol);
                }
            }
        }

        return adjacentIndices;
    }

    // 展示所有地雷
    function revealAllMines() {
        minePositions.forEach(index => {
            cells[index].style.backgroundColor = 'red';
        });
    }

    // 递归显示相邻的无雷单元格
    function revealAdjacentCells(index) {
        const adjacentIndices = getAdjacentIndices(index);
        for (let i = 0; i < adjacentIndices.length; i++) {
            const cell = cells[adjacentIndices[i]];
            if (!cell.classList.contains('mine') && !cell.style.backgroundColor) {
                const mineCount = countAdjacentMines(adjacentIndices[i]);
                cell.textContent = mineCount || '';
                cell.style.backgroundColor = 'lightgray';
                cell.removeEventListener('click', handleClick); // 防止重复点击
                if (mineCount === 0) {
                    revealAdjacentCells(adjacentIndices[i]);
                }
            }
        }
    }

    createBoard();
});

