const categories = {
    naruto: ['naruto', 'sasuke', 'sakura', 'kakashi', 'hinata', 'itachi', 'gaara',
             'rocklee', 'neji', 'shikamaru', 'jiraiya', 'tsunade', 'orochimaru',
             'minato', 'madara', 'obito', 'boruto', 'sarada'],
    anime: ['gojo', 'jinwoo', 'kirito', 'meliodas', 'luffy', 'zoro', 'sanji',
            'nami', 'usopp', 'chopper', 'robin', 'saitama', 'genos', 'tanjiro',
            'nezuko', 'zenitsu', 'giyu', 'ichigo', 'goku', 'vegeta'],
    games: ['zelda', 'mario', 'sonic', 'link', 'pikachu', 'kirby', 'samus',
            'bowser', 'yoshi', 'lucario', 'greninja', 'charizard', 'cloud',
            'sephiroth', 'tifa', 'kratos', 'ellie', 'geralt', 'arthur', 'gordon'],
    pokemon: ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charizard',
              'squirtle', 'blastoise', 'pikachu', 'raichu', 'eevee', 'snorlax',
              'dragonite', 'mewtwo', 'mew', 'lugia', 'rayquaza', 'giratina',
              'lucario', 'gengar', 'garchomp']
};

const stages = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
 |    |
 |    |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
 |    |
 |    |
 |    |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
 |    |
 |    |
 |    |
 |    |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
 |    |
 |    |
 |    |
 |    |
/ \\  |
=========`
];

let word, guessedWord, attempts, guessedLetters, hintsUsed, currentCategory, gameOver;

const $ = id => document.getElementById(id);

function startGame(category) {
    currentCategory = category;
    word = categories[category][Math.floor(Math.random() * categories[category].length)];
    guessedWord = Array(word.length).fill('_');
    attempts = 10;
    guessedLetters = [];
    hintsUsed = 0;
    gameOver = false;

    $('category-picker').style.display = 'none';
    $('game').style.display = 'block';
    $('play-again-btn').style.display = 'none';
    $('message').textContent = '';
    $('category-label').textContent = 'Category: ' + category;

    buildKeyboard();
    updateDisplay();
}

function buildKeyboard() {
    const kb = $('keyboard');
    kb.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(97 + i);
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.onclick = () => handleGuess(letter, btn);
        kb.appendChild(btn);
    }
}

function handleGuess(letter, btn) {
    if (gameOver) return;
    if (guessedLetters.includes(letter)) return;
    btn.disabled = true;

    if (word.includes(letter)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) guessedWord[i] = letter;
        }
    } else {
        attempts--;
    }
    guessedLetters.push(letter);
    updateDisplay();
    checkEnd();
}

function useHint() {
    if (gameOver) return;
    const hidden = [];
    for (let i = 0; i < word.length; i++) {
        if (guessedWord[i] === '_') hidden.push(i);
    }
    if (hidden.length === 0) return;

    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    const letter = word[pick];
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) guessedWord[i] = letter;
    }
    attempts--;
    hintsUsed++;
    const btn = document.querySelector(`#keyboard button[data-letter="${letter}"]`);
    if (btn) btn.disabled = true;
    if (!guessedLetters.includes(letter)) guessedLetters.push(letter);

    $('message').textContent = `Hint used! Revealed "${letter}".`;
    updateDisplay();
    checkEnd();
}

function updateDisplay() {
    $('stickman').textContent = stages[10 - attempts];
    $('word-display').textContent = guessedWord.join(' ');
    $('letters-tried').textContent = 'Letters tried: ' + guessedLetters.join(' ');
    $('attempts-display').textContent = 'Attempts left: ' + attempts + ' ' + '♥'.repeat(attempts);
}

function checkEnd() {
    if (!guessedWord.includes('_')) {
        gameOver = true;
        $('message').textContent = 'Oppai!! You guessed the word: ' + word;
        endGame();
    } else if (attempts <= 0) {
        gameOver = true;
        $('message').textContent = "You've run out of attempts! The word was: " + word;
        endGame();
    }
}

function endGame() {
    document.querySelectorAll('#keyboard button').forEach(b => b.disabled = true);
    $('play-again-btn').style.display = 'inline-block';
}

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.onclick = () => startGame(btn.dataset.cat);
});
$('hint-btn').onclick = useHint;
$('play-again-btn').onclick = () => {
    $('game').style.display = 'none';
    $('category-picker').style.display = 'block';
};