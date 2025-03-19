let resources = 0;
let resourceRate = 1;
let upgradeCost = 10;

let clickPower = 0;
let clickPowerRate = 1;
let clickProgressCost = 5;

let resourceUpgradeCost = 20;
let clickPowerUpgradeCost = 15;

function saveGame() {
    const gameState = {
        resources,
        resourceRate,
        upgradeCost,
        clickPower,
        clickPowerRate,
        clickProgressCost,
        resourceUpgradeCost,
        clickPowerUpgradeCost
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        resources = gameState.resources;
        resourceRate = gameState.resourceRate;
        upgradeCost = gameState.upgradeCost;
        clickPower = gameState.clickPower;
        clickPowerRate = gameState.clickPowerRate;
        clickProgressCost = gameState.clickProgressCost;
        resourceUpgradeCost = gameState.resourceUpgradeCost;
        clickPowerUpgradeCost = gameState.clickPowerUpgradeCost;
        updateDisplay();
    }
}

function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

function showResourceGain(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'resource-popup';
    popup.textContent = '+' + amount.toFixed(1);
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function updateDisplay() {
    document.getElementById('resources').innerText = resources.toFixed(2);
    document.getElementById('resourceRate').innerText = resourceRate.toFixed(2);
    document.getElementById('clickPower').innerText = clickPower.toFixed(2);
    document.getElementById('clickPowerRate').innerText = clickPowerRate.toFixed(2);
    document.getElementById('clickProgressCostButton').innerText = clickProgressCost.toFixed(2);
    document.getElementById('upgradeCostButton').innerText = upgradeCost.toFixed(2);
    document.getElementById('resourceUpgradeCostButton').innerText = resourceUpgradeCost.toFixed(2);
    document.getElementById('clickPowerUpgradeCostButton').innerText = clickPowerUpgradeCost.toFixed(2);

    // Update progress bars
    document.getElementById('resourceProgress').style.width = 
        ((resources % 10) / 10 * 100) + '%';
    document.getElementById('clickProgress').style.width = 
        ((clickPower % 10) / 10 * 100) + '%';
}

function generateResources() {
    resources += resourceRate;
    document.getElementById('resources').innerText = resources.toFixed(2);
}

function manualGenerateClickPower(event) {
    clickPower += clickPowerRate;
    createParticles(event.clientX, event.clientY);
    showResourceGain(event.clientX, event.clientY, clickPowerRate);
    updateDisplay();
}

function buyUpgrade() {
    if (resources >= upgradeCost) {
        resources -= upgradeCost;
        resourceRate += 1;
        upgradeCost += Math.log(upgradeCost + 1) * 5;  // Reduced multiplier for slower progression
        document.getElementById('resources').innerText = resources.toFixed(2);
        document.getElementById('resourceRate').innerText = resourceRate.toFixed(2);
        document.getElementById('upgradeCostButton').innerText = upgradeCost.toFixed(2);
    }
}

function buyClickProgress() {
    if (clickPower >= clickProgressCost) {
        clickPower -= clickProgressCost;
        clickPowerRate += 1;
        clickProgressCost += Math.log(clickProgressCost + 1) * 5;  // Reduced multiplier for slower progression
        document.getElementById('clickPower').innerText = clickPower.toFixed(2);
        document.getElementById('clickPowerRate').innerText = clickPowerRate.toFixed(2);
        document.getElementById('clickProgressCostButton').innerText = clickProgressCost.toFixed(2);  // Ensure this updates correctly
    }
}

function buyResourceUpgrade() {
    if (clickPower >= resourceUpgradeCost) {
        clickPower -= resourceUpgradeCost;
        resourceRate += 2;  // Increase resource generation rate
        resourceUpgradeCost += Math.log(resourceUpgradeCost + 1) * 5;  // Reduced multiplier for slower progression
        document.getElementById('clickPower').innerText = clickPower.toFixed(2);
        document.getElementById('resourceRate').innerText = resourceRate.toFixed(2);
        document.getElementById('resourceUpgradeCostButton').innerText = resourceUpgradeCost.toFixed(2);
    }
}

function buyClickPowerUpgrade() {
    if (resources >= clickPowerUpgradeCost) {
        resources -= clickPowerUpgradeCost;
        clickPowerRate += 2;  // Increase click power gain rate
        clickPowerUpgradeCost += Math.log(clickPowerUpgradeCost + 1) * 5;  // Reduced multiplier for slower progression
        document.getElementById('resources').innerText = resources.toFixed(2);
        document.getElementById('clickPowerRate').innerText = clickPowerRate.toFixed(2);
        document.getElementById('clickPowerUpgradeCostButton').innerText = clickPowerUpgradeCost.toFixed(2);
    }
}

document.getElementById('generateButton').addEventListener('click', manualGenerateClickPower);
document.getElementById('clickProgressButton').addEventListener('click', buyClickProgress);
document.getElementById('upgradeButton').addEventListener('click', buyUpgrade);
document.getElementById('resourceUpgradeButton').addEventListener('click', buyResourceUpgrade);
document.getElementById('clickPowerUpgradeButton').addEventListener('click', buyClickPowerUpgrade);

// Load saved game on start
loadGame();

// Auto-save every minute
setInterval(saveGame, 60000);

// Generate resources every second
setInterval(generateResources, 1000);

// Add save button functionality
document.getElementById('saveButton').addEventListener('click', () => {
    saveGame();
    alert('Game saved!');
});