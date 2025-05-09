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
        const savedButtons = savedState.buttons || [];

        // Update the level display immediately
        levelDisplay.textContent = level;

        // Calculate elapsed time and reduce points accordingly
        const elapsedSeconds = Math.floor((Date.now() - lastUpdated) / 1000);
        currentPoints = Math.max(0, currentPoints - elapsedSeconds * depletionRate);
        while (currentPoints >= maxPoints) {
            handleLevelUp();
        }

        // Restore buttons
        savedButtons.forEach((button) => {
            createButton(button.label, button.weight);
        });
    }
}

// Save state to localStorage
function saveState() {
    const buttons = Array.from(buttonContainer.querySelectorAll('.action-button')).map((button) => ({
        label: button.textContent,
        weight: button.dataset.weight,
    }));

    const state = {
        currentPoints,
        level,
        depletionRate,
        lastUpdated: Date.now
