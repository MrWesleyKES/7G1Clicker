let resources = 0;
let resourceRate = 1;
let upgradeCost = 10;

let clickPower = 0;
let clickPowerRate = 1;
let clickProgressCost = 5;

let resourceUpgradeCost = 20;
let clickPowerUpgradeCost = 15;
let badWork = 0;
let badWorkUnlocked = false;

function saveGame() {
    const gameState = {
        resources,
        resourceRate,
        upgradeCost,
        clickPower,
        clickPowerRate,
        clickProgressCost,
        resourceUpgradeCost,
        clickPowerUpgradeCost,
        badWork,
        badWorkUnlocked
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
        badWork = gameState.badWork || 0;
        badWorkUnlocked = gameState.badWorkUnlocked || false;
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
    if (badWorkUnlocked) {
        document.getElementById('badWorkCounter').style.display = 'block';
        document.getElementById('removeBadWorkButton').style.display = 'block';
        document.getElementById('badWork').innerText = badWork.toFixed(0);
    }
    document.getElementById('resources').innerText = resources.toFixed(2);
    document.getElementById('resourceRate').innerText = resourceRate.toFixed(2);
    document.getElementById('clickPower').innerText = clickPower.toFixed(2);
    document.getElementById('clickPowerRate').innerText = clickPowerRate.toFixed(2);
    document.getElementById('clickProgressCostButton').innerText = clickProgressCost.toFixed(2);
    document.getElementById('upgradeCostButton').innerText = upgradeCost.toFixed(2);
    document.getElementById('resourceUpgradeCostButton').innerText = resourceUpgradeCost.toFixed(2);
    document.getElementById('clickPowerUpgradeCostButton').innerText = clickPowerUpgradeCost.toFixed(2);

    // Update progress bars for upgrades
    document.getElementById('clickProgressBar').style.width = 
        Math.min((clickPower / clickProgressCost) * 100, 100) + '%';
    document.getElementById('upgradeBar').style.width = 
        Math.min((resources / upgradeCost) * 100, 100) + '%';
    document.getElementById('resourceUpgradeBar').style.width = 
        Math.min((clickPower / resourceUpgradeCost) * 100, 100) + '%';
    document.getElementById('clickPowerUpgradeBar').style.width = 
        Math.min((resources / clickPowerUpgradeCost) * 100, 100) + '%';
}

function generateResources() {
    resources += resourceRate;
    updateDisplay();
}

function manualGenerateClickPower(event) {
    if (Math.random() < 0.01) { // 1% chance of Bad Work
        badWork++;
        badWorkUnlocked = true;
        clickPowerRate = Math.max(1, clickPowerRate - 1); // Reduce good work rate, minimum 1
        createParticles(event.clientX, event.clientY);
        showResourceGain(event.clientX, event.clientY, -1);
    } else {
        clickPower += clickPowerRate;
        createParticles(event.clientX, event.clientY);
        showResourceGain(event.clientX, event.clientY, clickPowerRate);
    }
    updateDisplay();
}

function removeBadWork() {
    if (resources >= badWork && badWork > 0) {
        resources -= badWork;
        clickPowerRate += badWork; // Restore good work rate
        badWork = 0;
        updateDisplay();
    }
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
        resourceRate += 2;  // Increase time generation rate
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

function resetGame() {
    if (confirm('Are you sure you want to reset? This will erase all progress!')) {
        resources = 0;
        resourceRate = 1;
        upgradeCost = 10;
        clickPower = 0;
        clickPowerRate = 1;
        clickProgressCost = 5;
        resourceUpgradeCost = 20;
        clickPowerUpgradeCost = 15;
        localStorage.removeItem('gameState');
        updateDisplay();
        alert('Game reset complete!');
    }
}

document.getElementById('resetButton').addEventListener('click', resetGame);

function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let button of tabButtons) {
        button.classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}