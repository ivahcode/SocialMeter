let maxPoints = 100; // Maximum points to fill the meter
let currentPoints = 0;
let level = 1;
let depletionRate = maxPoints / (24 * 60 * 60); // Points per second for 1 day
let interval;

// HTML elements
const meter = document.getElementById('meter');
const levelDisplay = document.getElementById('level');
const buttonContainer = document.getElementById('button-container');
const buttonLabelInput = document.getElementById('button-label');
const buttonWeightInput = document.getElementById('button-weight');
const addButton = document.getElementById('add-button');

// Load state from localStorage
function loadState() {
    const savedState = JSON.parse(localStorage.getItem('meterState'));
    if (savedState) {
        currentPoints = savedState.currentPoints || 0;
        level = savedState.level || 1;
        depletionRate = savedState.depletionRate || depletionRate;
        const lastUpdated = savedState.lastUpdated || Date.now();

        // Calculate elapsed time and reduce points accordingly
        const elapsedSeconds = Math.floor((Date.now() - lastUpdated) / 1000);
        currentPoints = Math.max(0, currentPoints - elapsedSeconds * depletionRate);
        while (currentPoints >= maxPoints) {
            handleLevelUp();
        }
    }
}

// Save state to localStorage
function saveState() {
    const state = {
        currentPoints,
        level,
        depletionRate,
        lastUpdated: Date.now(),
    };
    localStorage.setItem('meterState', JSON.stringify(state));
}

// Update the meter display
function updateMeter() {
    const percentage = (currentPoints / maxPoints) * 100;
    meter.style.width = `${Math.min(percentage, 100)}%`;

    if (currentPoints >= maxPoints) {
        handleLevelUp();
    }
    saveState();
}

// Handle leveling up
function handleLevelUp() {
    const excessPoints = currentPoints - maxPoints; // Calculate leftover points
    level++;
    currentPoints = excessPoints; // Carry over excess points to the next level
    depletionRate *= 1.1; // Increase depletion rate by 10%
    levelDisplay.textContent = level;
    alert(`Congratulations! You've leveled up to Level ${level}!`);
    updateMeter();
}

// Decrease meter points over time
function startDepletion() {
    interval = setInterval(() => {
        if (currentPoints > 0) {
            currentPoints -= depletionRate;
            updateMeter();
        }
    }, 1000); // Update every second
}

// Add points to the meter
function addPoints(points) {
    currentPoints += points;
    updateMeter();
}

// Add click event listeners to action buttons
buttonContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('action-button')) {
        const weight = parseInt(event.target.dataset.weight, 10);
        addPoints(weight);
    }
});

// Add new button functionality
addButton.addEventListener('click', () => {
    const label = buttonLabelInput.value.trim();
    const weight = parseInt(buttonWeightInput.value, 10);

    if (label && weight > 0) {
        const newButton = document.createElement('button');
        newButton.classList.add('action-button');
        newButton.textContent = label; // Use the label as button text
        newButton.setAttribute('data-weight', weight);

        buttonContainer.appendChild(newButton);

        // Clear inputs
        buttonLabelInput.value = '';
        buttonWeightInput.value = '';
    } else {
        alert('Please enter a valid label and weight.');
    }
});

// Initialize application
loadState();
updateMeter();
startDepletion();
