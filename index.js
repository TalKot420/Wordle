import { testDictionary, realDictionary } from './dictionary.js';

// Define an array of keys
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P', //9
    'A', //10
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L', //18
    'ENTER',//19
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DEL',
];

// Choose a dictionary to use
const dictionary = realDictionary;

// Define the initial state
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)], // Choose a random secret word from the dictionary
    grid: Array(6).fill().map(() => Array(5).fill('')), // Initialize an empty grid
    currentRow: 0, // Current row in the grid
    currentCol: 0, // Current column in the grid
    usedLetters: Array(24), // Array to keep track of used letters
};

// Function to update the grid on the screen
function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

// Function to draw a box element
function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

// Function to draw the grid on the screen
function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

// Function to register keyboard events
const registerKeyboardEvents = () => {
    document.body.onkeyup = (e) => {
        const key = e.key;
        checkInput(e.key);
    };
};

// Function to check the input from the keyboard
function checkInput(key) {
    if (key === 'Enter' || key === 'ENTER') {
        console.log("KEYBOARD ENTER");
        if (state.currentCol === 5) {
            const word = getCurrectWord();
            if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++;
                state.currentCol = 0;
            } else {
                alert("Not a valid word");
            }
        } else if (state.currentCol <= 5) {
            return false;
        }
    } else if (key === 'Backspace' || key === 'DEL') {
        removeLetter();
    } else if (isLetter(key)) {
        console.log("adding KEYBOARDLY the " + key);
        addLetter(key);
    }
    updateGrid();
}

// Function to get the current word from the grid
function getCurrectWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr).toLowerCase();
}

// Function to check if a word is valid
function isWordValid(word) {
    return dictionary.includes(word);
}

// Function to update the keyboard keys based on the user's guess
function updateKeys(guess) {
    console.log("im number 1");
    console.log(guess);
    for (let i = 0; i < 5; i++) {
        const key = document.getElementById(`${guess[i].toUpperCase()}`);
        console.log(key);
        if (guess[i] === state.secret[i]) {
            key.classList.add('right');
        } else if (state.secret.includes(guess[i])) {
            key.classList.add('wrong');
        } else {
            key.classList.add('empty');
        }
    }
}

// Function to reveal the word on the screen
function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500; //ms
    console.log(guess.toUpperCase());
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const key = document.getElementById(`${box.innerText}`);
        const letter = box.textContent.toLowerCase();
        box.classList.remove('selected');

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, ((i + 1) * animation_duration) / 2);
        box.classList.remove('select');
        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations!');
        } else if (isGameOver) {
            alert(`Better luck next time! The word was ${state.secret}.`);
        }
        updateKeys(guess);
    }, 3 * animation_duration);
}

// Function to check if a key is a letter
function isLetter(key) {
    if (key.length === 1 && key.match(/[a-z]/i)) {
        try {
            const row = state.currentRow;
            const box = document.getElementById(`box${row}${state.currentCol}`);
            box.classList.add('select');
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
}

// Function to add a letter to the grid
function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
    console.log("The Current is " + state.currentCol + state.currentRow);
}

// Function to remove a letter from the grid
function removeLetter() {
    if (state.currentCol === 0) return;
    const row = state.currentRow;
    const box = document.getElementById(`box${row}${state.currentCol - 1}`);
    box.classList.remove('select');
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

// Function to initialize the game
function startup() {
    const game = document.getElementById('game');
    drawgame(game);
    registerKeyboardEvents();
    console.log(state.secret);
}

// Function to draw the game on the screen
function drawgame(container) {
    drawGrid(container);
    createKeyBoard(container);
}

// Function to create the keyboard
function createKeyBoard(container) {
    const keyBoard = document.createElement('div');
    keyBoard.className = 'keyboard';
    container.appendChild(keyBoard);
    createRows(keyBoard);
}

// Function to create rows in the keyboard
function createRows(container) {
    const rows = Array(3);
    for (let i = 0; i < 3; i++) {
        rows[i] = document.createElement('div');
        rows[i].className = `row${i + 1}`;
        container.append(rows[i]);
    }
    createRowButtons(0, 10, 0, rows[0]);
    createRowButtons(1, 9, 10, rows[1]);
    createRowButtons(2, 9, 19, rows[2]);
}

// Function to create buttons in a row of the keyboard
function createRowButtons(rowNum, numOfKeys, index, container) {
    for (let i = index; i < index + numOfKeys; i++) {
        const keyBtn = document.createElement('button');
        keyBtn.className = 'keyboard-button';
        keyBtn.setAttribute('id', keys[i]);
        keyBtn.innerText = keys[i];
        keyBtn.addEventListener('click', () => handleClick(keys[i]));
        container.appendChild(keyBtn);
    }
}

// Function to handle the click event on a key button
const handleClick = (key) => {
    console.log('clicked virtual ', `${key}`);
    checkInput(key);
};

// Start the game
startup();
