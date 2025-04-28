// Import Firebase modules (Make sure paths are correct)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Firebase Configuration ---
// (USE THE SAME CONFIGURATION as in your dashboard.js)
const firebaseConfig = {
  apiKey: "AIzaSyB4shH6owP4rwuYTwEIcRjaZRJh5p6b_6s", // Replace with your actual API key if hidden previously
  authDomain: "apexgames-a5903.firebaseapp.com",
  projectId: "apexgames-a5903",
  storageBucket: "apexgames-a5903.appspot.com",
  messagingSenderId: "927388647652",
  appId: "1:927388647652:web:f065997c4969510b056cf1",
  measurementId: "G-B5GKRLC8X7"
};

// --- Initialize Firebase ---
let auth;
try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("Firebase initialized on Bug Hunter page.");
} catch (error) {
    console.error("Error initializing Firebase on Bug Hunter page:", error);
    document.body.innerHTML = '<h1>Error loading game dependencies. Please try again later.</h1>';
    throw new Error("Firebase initialization failed"); // Stop script if Firebase fails
}

// --- Game Data ---
// Expanded list of 50 bugs
const bugs = [
    // --- Original 5 ---
    {
        id: 1,
        buggyCode: "function greet(name) {\n  console.log('Hello, ' + name)\n}", // Missing semicolon
        correctSolution: "console.log('Hello, ' + name);"
    },
    {
        id: 2,
        buggyCode: "function checkAge(age) {\n  if (age = 18) {\n    return 'Adult';\n  }\n  return 'Minor';\n}", // Assignment instead of comparison
        correctSolution: "if (age === 18) {" // Or == 18, but === is often preferred
    },
    {
        id: 3,
        buggyCode: "functon calculateSum(a, b) {\n  return a + b;\n}", // Misspelled keyword 'functon'
        correctSolution: "function calculateSum(a, b) {"
    },
    {
        id: 4,
        buggyCode: "const pi = 3.14;\nconsole.log('The value of pi is: ' + pi;", // Missing closing parenthesis
        correctSolution: "console.log('The value of pi is: ' + pi);"
    },
     {
        id: 5,
        buggyCode: "const message = 'It's a sunny day!';\nconsole.log(message);", // Unescaped single quote
        correctSolution: "const message = 'It\\'s a sunny day!';" // Or "const message = \"It's a sunny day!\";"
    },
    // --- Adding 45 more ---
    {
        id: 6,
        buggyCode: "let count = 0\ncount++\nconsole.log(count);", // Missing semicolon between statements on same line conceptually (if written inline) or just missing generally
        correctSolution: "let count = 0;"
    },
    {
        id: 7,
        buggyCode: "for (let i = 0 i < 5; i++) {\n console.log(i);\n}", // Missing semicolon in for loop condition
        correctSolution: "for (let i = 0; i < 5; i++) {"
    },
    {
        id: 8,
        buggyCode: "const colors = ['red', 'green', 'blue'];\nconsole.log(colors[3]);", // Array index out of bounds
        correctSolution: "console.log(colors[2]);" // Accessing last valid index
    },
    {
        id: 9,
        buggyCode: "let user = { name: 'Bob' };\nconsole.log(user.nme);", // Misspelled property name
        correctSolution: "console.log(user.name);"
    },
    {
        id: 10,
        buggyCode: "function multiply(a, b) {\n return a * b // Missing semicolon\n}",
        correctSolution: "return a * b;"
    },
    {
        id: 11,
        buggyCode: "if ( x > 10 ) {\n console.log('Greater');\n}", // Unnecessary space before parenthesis (though often works, style guides dislike it) - Better bug: undeclared variable 'x'
        buggyCode: "if (x > 10) { console.log('Greater'); }", // Using undeclared variable 'x'
        correctSolution: "let x = 15; if (x > 10) { console.log('Greater'); }" // Simplest fix: declare x
    },
    {
        id: 12,
        buggyCode: "const arr = [1, 2, 3;\nconsole.log(arr);", // Missing closing square bracket
        correctSolution: "const arr = [1, 2, 3];"
    },
    {
        id: 13,
        buggyCode: "document.queryselector('#myElement');", // Misspelled method 'queryselector'
        correctSolution: "document.querySelector('#myElement');"
    },
    {
        id: 14,
        buggyCode: "let temperature = 25;\nif (temperature > 30) {\n console.log('Hot');\n else {\n console.log('Warm');\n}", // Missing closing brace for if block
        correctSolution: "} else {"
    },
    {
        id: 15,
        buggyCode: "function sayHi() \n console.log('Hi!');\n}", // Missing opening brace for function body
        correctSolution: "function sayHi() {"
    },
    {
        id: 16,
        buggyCode: "let value = '5';\nif (value === 5) {\n console.log('Equal');\n}", // Strict equality fails (string vs number)
        correctSolution: "if (value == 5) {" // Or: let value = 5;
    },
    {
        id: 17,
        buggyCode: "setTimeout(myFunction, 1000);", // Using function before declaration (will hoist, but good practice to define first) - Better bug: calling undefined function
        buggyCode: "setTimeout(myFunction, 1000);", // Calling a non-existent function 'myFunction'
        correctSolution: "function myFunction() { console.log('Delayed'); } setTimeout(myFunction, 1000);" // Need to define it
    },
    {
        id: 18,
        buggyCode: "const person = { name: 'Alice', age: 30 }\nconsole.log(person);", // Missing comma between properties
        correctSolution: "const person = { name: 'Alice', age: 30 };"
    },
    {
        id: 19,
        buggyCode: "let message = \"Hello World\";\nconsole.log(mesage);", // Misspelled variable name 'mesage'
        correctSolution: "console.log(message);"
    },
    {
        id: 20,
        buggyCode: "'use strict';\nlet public = 123;", // Using reserved keyword 'public' as variable name in strict mode
        correctSolution: "let pub = 123;" // Use a different name
    },
    {
        id: 21,
        buggyCode: "console.log('Result:' + (5 - '2'));", // Implicit type coercion results in 3, maybe unintended? Better bug: using wrong variable
        buggyCode: "let num1 = 5; let num2 = '2'; console.log('Result:' + (num1 - num3));", // Using undefined variable num3
        correctSolution: "console.log('Result:' + (num1 - num2));" // Use correct variable num2 (which might still need parsing depending on intent)
    },
    {
        id: 22,
        buggyCode: "const numbers = [1, 2, 3, 4];\nnumbers.push[5];", // Using square brackets instead of parentheses for push method
        correctSolution: "numbers.push(5);"
    },
    {
        id: 23,
        buggyCode: "if (isValid = false) {\n  console.log('Not valid!');\n}", // Assignment instead of comparison
        correctSolution: "if (isValid === false) {" // Or if (!isValid) {
    },
    {
        id: 24,
        buggyCode: "function greetUser(name) {\n  console.log('Welcome, ${name}!');\n}", // Using template literal syntax with single quotes
        correctSolution: "console.log(`Welcome, ${name}!`);" // Use backticks
    },
    {
        id: 25,
        buggyCode: "let i = 0;\nwhile (i < 5);\n{\n  console.log(i);\n  i++;\n}", // Errant semicolon after while condition creates infinite loop conceptually
        correctSolution: "while (i < 5) {" // Remove semicolon
    },
    {
        id: 26,
        buggyCode: "const myString = 'JavaScript';\nconsole.log(myString.lenght);", // Misspelled property 'lenght'
        correctSolution: "console.log(myString.length);"
    },
    {
        id: 27,
        buggyCode: "let data = null;\nconsole.log(data.value);", // Trying to access property 'value' of null
        correctSolution: "if (data) { console.log(data.value); }" // Add check before accessing
    },
    {
        id: 28,
        buggyCode: "function calculateArea(width, height) {\n  retrun width * height;\n}", // Misspelled keyword 'retrun'
        correctSolution: "return width * height;"
    },
    {
        id: 29,
        buggyCode: "const settings = { theme: 'dark', fontSize: 12 };\nconsole.log(settings[theme]);", // Accessing property using variable 'theme' instead of string literal 'theme'
        correctSolution: "console.log(settings['theme']);" // Or settings.theme
    },
    {
        id: 30,
        buggyCode: "alert('Hello World!);", // Missing closing quote
        correctSolution: "alert('Hello World!');"
    },
    {
        id: 31,
        buggyCode: "for (let i = 0; i <= 10; i+) {\n console.log(i);\n}", // Missing second '+' in increment operator
        correctSolution: "for (let i = 0; i <= 10; i++) {"
    },
    {
        id: 32,
        buggyCode: "let text = 'Hello';\ntext.toUppercase();", // Misspelled method 'toUppercase'
        correctSolution: "text.toUpperCase();"
    },
    {
        id: 33,
        buggyCode: "let score = 100\nif score > 50 {\n console.log('Pass');\n}", // Missing parentheses around condition
        correctSolution: "if (score > 50) {"
    },
    {
        id: 34,
        buggyCode: "const obj = {};\nobj[my key] = 'value';", // Space in property key requires quotes
        correctSolution: "obj['my key'] = 'value';"
    },
    {
        id: 35,
        buggyCode: "Math.random * 10;", // Calling random as a property instead of a function
        correctSolution: "Math.random() * 10;"
    },
    {
        id: 36,
        buggyCode: "parseInt('12a3');", // String doesn't fully parse, maybe unintended. Better bug: forget radix
        buggyCode: "parseInt('08');", // Without radix 10, might interpret as octal in older engines (though modern ones default to 10)
        correctSolution: "parseInt('08', 10);" // Always specify radix
    },
    {
        id: 37,
        buggyCode: "let x = 5;\nx = x + 'px';\nx = x + 10;", // Adding number to string '5px' results in '5px10'
        correctSolution: "x = parseInt(x) + 10;" // Need to parse back to number before adding
    },
    {
        id: 38,
        buggyCode: "function logMessage(msg){\n console.log(msg)\n } logMessage('Test');", // Missing semicolon after function expression/declaration if needed contextually, or just generally
        correctSolution: "console.log(msg);"
    },
    {
        id: 39,
        buggyCode: "const promise = New Promise((resolve, reject) => {});", // 'New' keyword capitalized
        correctSolution: "const promise = new Promise((resolve, reject) => {});"
    },
    {
        id: 40,
        buggyCode: "let car = { make: 'Toyota', model; 'Camry' };", // Semicolon instead of colon for property
        correctSolution: "model: 'Camry' };"
    },
    {
        id: 41,
        buggyCode: "[1, 2, 3].map(num => num * 2)", // Missing semicolon if this is the end of a statement line
        correctSolution: "[1, 2, 3].map(num => num * 2);"
    },
    {
        id: 42,
        buggyCode: "console.log(typeof undeclaredVar);", // Checking typeof undeclared variable results in 'undefined', maybe unintended. Better bug: using it directly
        buggyCode: "console.log(undeclaredVar);", // Using undeclared variable
        correctSolution: "let undeclaredVar = null; console.log(undeclaredVar);" // Declare it first
    },
    {
        id: 43,
        buggyCode: "switch (value) {\n case 1:\n console.log('One');\n case 2:\n console.log('Two');\n break;\n}", // Missing break after case 1 (fallthrough)
        correctSolution: "console.log('One');\n break;" // Add break statement
    },
    {
        id: 44,
        buggyCode: "let name = 'World';\nconsole.log('Hello, ' + name! );", // Exclamation mark inside quotes
        correctSolution: "console.log('Hello, ' + name + '!');"
    },
    {
        id: 45,
        buggyCode: "const details = { id: 1 };\ndetails = { id: 2 };", // Trying to reassign a const variable
        correctSolution: "let details = { id: 1 };" // Change const to let
    },
    {
        id: 46,
        buggyCode: "document.getElementById('btn').addEventlistener('click', handleClick);", // Misspelled 'addEventlistener'
        correctSolution: "addEventListener('click', handleClick);"
    },
    {
        id: 47,
        buggyCode: "function isEven(num) { return num % 2 = 0; }", // Assignment instead of comparison
        correctSolution: "return num % 2 === 0;"
    },
    {
        id: 48,
        buggyCode: "console.log('Logging...' // Missing closing parenthesis for console.log",
        correctSolution: "console.log('Logging...');"
    },
    {
        id: 49,
        buggyCode: "if (true) {\n let blockVar = 'visible';\n}\nconsole.log(blockVar);", // Accessing block-scoped variable outside its scope
        correctSolution: "let blockVar; if (true) { blockVar = 'visible'; } console.log(blockVar);" // Declare outside the block
    },
    {
        id: 50,
        buggyCode: "const items = ['a', 'b', 'c']\nitems.forEach(item => console.log(item));", // Missing semicolon between array and forEach line if needed, or just generally
        correctSolution: "const items = ['a', 'b', 'c'];"
    }
];


// --- Game State Variables --- (Can stay global)
let currentScore = 0;
let currentTime = 30;
let timerInterval = null;
let currentBugIndex = 0;
let gameUserId = null; // Store logged-in user's ID

// --- DOM Element Variables --- (Declare globally, assign inside init)
let timerElement, scoreElement, codeSnippetElement, userSolutionElement,
    submitButton, feedbackElement, startScreen, gameArea,
    gameOverScreen, startButton, restartButton, finalScoreElement;

// --- Game Functions --- (Definitions can stay global)

function normalizeCode(code) {
    return code.replace(/\s+/g, ' ').trim();
}

function displayBug() {
     if (!codeSnippetElement || !userSolutionElement || !feedbackElement) return; // Guard clause
    if (currentBugIndex >= bugs.length) {
        gameOver("You've cleared all the bugs!");
        return;
    }
    const bug = bugs[currentBugIndex];
    codeSnippetElement.textContent = bug.buggyCode;
    userSolutionElement.value = '';
    feedbackElement.textContent = '';
    feedbackElement.className = '';
}

function updateTimerDisplay() {
     if (!timerElement) return; // Guard clause
    timerElement.textContent = `Time Left: ${currentTime}s`;
}

function updateScoreDisplay() {
     if (!scoreElement) return; // Guard clause
    scoreElement.textContent = `Score: ${currentScore}`;
}

function startTimer() {
    clearInterval(timerInterval);
    currentTime = 30;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            gameOver("Time's up!");
        }
    }, 1000);
}

function checkSolution() {
     if (!userSolutionElement || !feedbackElement || currentBugIndex >= bugs.length) return; // Guard clauses

    const userSolution = normalizeCode(userSolutionElement.value);
    const correctSolution = normalizeCode(bugs[currentBugIndex].correctSolution);

    if (userSolution === correctSolution) {
        currentScore++;
        updateScoreDisplay();
        feedbackElement.textContent = "Correct! +1 Point";
        feedbackElement.className = 'feedback-correct';
        clearInterval(timerInterval);
        setTimeout(() => {
            currentBugIndex++;
            if (currentBugIndex < bugs.length) {
                 displayBug();
                 startTimer();
            } else {
                 gameOver("You fixed all the bugs!");
            }
        }, 1000);
    } else {
        feedbackElement.textContent = "Incorrect. Try again!";
        feedbackElement.className = 'feedback-incorrect';
    }
}

function startGame() {
     if (!startScreen || !gameOverScreen || !gameArea) return; // Guard clauses
    console.log("Starting game...");
    currentScore = 0;
    currentBugIndex = 0;
    updateScoreDisplay();

    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    gameArea.classList.add('active');

    displayBug();
    startTimer();
}

function gameOver(reason) {
     if (!gameArea || !gameOverScreen || !finalScoreElement || !feedbackElement) return; // Guard clauses
    console.log("Game Over:", reason);
    clearInterval(timerInterval);
    gameArea.classList.remove('active');
    gameOverScreen.classList.add('active');
    finalScoreElement.textContent = currentScore;
    feedbackElement.textContent = reason;
    feedbackElement.className = 'feedback-incorrect';
}


// --- Authentication Check --- (Runs after Firebase init)
onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed on Bug Hunter page.");
    if (user) {
        // User is signed in.
        console.log("User is logged in:", user.uid);
        // Initialize the game now that we know the user is authenticated
        initializeBugHunterGame(user.uid);

        // Make the game container visible if using the loading message pattern
        if (window.showGameContainer) {
            window.showGameContainer();
        }

    } else {
        // User is signed out.
        console.log("User is not logged in. Redirecting to index.html.");
        // Redirect them to the login page
        window.location.replace('/index.html'); // Adjust path if index.html isn't at root
    }
});


// --- Initialization Function --- (Called only when user is logged in)
function initializeBugHunterGame(uid) {
    console.log("Initializing Bug Hunter Game UI and Logic...");
    gameUserId = uid; // Store user ID

    // Assign DOM Elements now
    timerElement = document.getElementById('timer');
    scoreElement = document.getElementById('score');
    codeSnippetElement = document.getElementById('code-snippet');
    userSolutionElement = document.getElementById('user-solution');
    submitButton = document.getElementById('submit-button');
    feedbackElement = document.getElementById('feedback');
    startScreen = document.getElementById('start-screen');
    gameArea = document.getElementById('game-area');
    gameOverScreen = document.getElementById('game-over-screen');
    startButton = document.getElementById('start-button');
    restartButton = document.getElementById('restart-button');
    finalScoreElement = document.getElementById('final-score');

    // --- CRITICAL: Check if all elements were found ---
     if (!timerElement || !scoreElement || !codeSnippetElement || !userSolutionElement ||
        !submitButton || !feedbackElement || !startScreen || !gameArea ||
        !gameOverScreen || !startButton || !restartButton || !finalScoreElement) {
        console.error("FATAL: One or more required Bug Hunter game elements not found in the HTML! Check IDs.");
        // Display error clearly instead of failing silently
        document.body.innerHTML = '<h1>Error loading game UI. Required element missing. Check console.</h1>';
        return; // Stop initialization if UI is broken
    }

    // --- Add Event Listeners (Moved Here) ---
    startButton.addEventListener('click', startGame);
    submitButton.addEventListener('click', checkSolution);
    restartButton.addEventListener('click', startGame);

    // Optional: Enter key submission
    userSolutionElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            checkSolution();
        }
    });

    // --- Initial UI Setup (Moved Here) ---
    // Ensure only start screen is visible initially AFTER elements are assigned
    gameArea.classList.remove('active');
    gameOverScreen.classList.remove('active');
    startScreen.classList.add('active'); // Show the start screen

    console.log("Bug Hunter Game Initialized Successfully.");
}

// --- End of script ---
