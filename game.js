// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0; // Initialize score

// DOM elements
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const scoreBoard = document.getElementById("score");
const mismatchStatus = document.getElementById("mismatch-status"); 
const danglingStatus = document.getElementById("dangling-status"); 

// Initialize the game
function initializeGame() {
    const ranks = Array.from({ length: 8 }, (_, i) => `Memory Block ${i + 1}`);
    cards = [...ranks, ...ranks]; 

    shuffle(cards); // Shuffle the deck
    renderGameBoard(); // Render the cards
    matchedPairs = 0; // Reset matches
    score = 0; // Reset score
    scoreBoard.textContent = score; // Update score display
    statusText.textContent = "Allocate memory by matching pairs!";
    mismatchStatus.textContent = ""; // Clear previous mismatch notifications
    danglingStatus.textContent = ""; // Clear previous dangling pointer notifications
}

// Shuffle the cards
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Render the game board
function renderGameBoard() {
    gameBoard.innerHTML = ""; // Clear previous board
    cards.forEach((rank, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.rank = rank;
        card.dataset.index = index; // Store the card index

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const frontFace = document.createElement("div");
        frontFace.classList.add("front-face");

        const backFace = document.createElement("div");
        backFace.classList.add("back-face");
        backFace.textContent = rank;

        cardInner.appendChild(frontFace);
        cardInner.appendChild(backFace);
        card.appendChild(cardInner);

        card.addEventListener("click", () => handleCardClick(card));
        gameBoard.appendChild(card);
    });

    // Show cards face-up for 2 seconds at the start
    setTimeout(() => {
        const allCards = document.querySelectorAll(".card");
        allCards.forEach((card) => {
            card.classList.add("flipped"); // Show all cards face-up initially
        });

        // Hide the cards after 2 seconds (start the game)
        setTimeout(() => {
            allCards.forEach((card) => {
                card.classList.remove("flipped");
            });
        }, 4000); // Cards will be flipped back after 4 seconds
    }, 100); // Delay for initial flip-up effect
}

// Handle card clicks
function handleCardClick(card) {
    // Check if the card has already been deallocated (removed from the game)
    if (!card.dataset.rank || card.classList.contains("matched")) {
        showDanglingPointerError(card);
        return;
    }

    flipCard(card);
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Flip a card
function flipCard(card) {
    card.classList.add("flipped");
    statusText.textContent = `Allocating memory for ${card.dataset.rank}...`;
}

// Check for a match
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.rank === card2.dataset.rank) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
        score++; // Award a point for a match
        statusText.textContent = `Memory blocks ${card1.dataset.rank} and ${card2.dataset.rank} allocated!`;

        // Update the score display
        scoreBoard.textContent = score;

        if (matchedPairs === cards.length / 2) {
            statusText.textContent = "All memory blocks allocated! You win!";
        }

        mismatchStatus.textContent = ""; // Clear any previous mismatch messages
    } else {
        mismatchStatus.textContent = "Cards do not match. Deallocating memory!";
        setTimeout(() => {
            deallocateMemory(card1, card2);
        }, 1000); // Deallocate memory after a short delay
    }

    flippedCards = [];
}

// Deallocate memory (remove cards if they don't match)
function deallocateMemory(card1, card2) {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");

    score--; // Penalize for incorrect match (dangling pointer)
    scoreBoard.textContent = score;

    mismatchStatus.textContent = "Cards do not match. Memory deallocated.";
}

// Show dangling pointer error
function showDanglingPointerError(card) {
    danglingStatus.textContent = `Dangling Pointer Error! ${card.dataset.rank} is already deallocated.`;
    score--; // Penalize for trying to access deallocated memory
    scoreBoard.textContent = score;
}

// Restart the game
restartButton.addEventListener("click", () => {
    statusText.textContent = "Restarting the game and reallocating memory...";
    gameBoard.innerHTML = ""; // Clear the board
    matchedPairs = 0;
    initializeGame(); // Reinitialize the game
});

// Initialize the game on page load
initializeGame();