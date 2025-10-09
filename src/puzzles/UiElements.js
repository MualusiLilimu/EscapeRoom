// uiElements.js

export function createCrosshair() {
  const crosshair = document.createElement('div');
  crosshair.style.position = 'absolute';
  crosshair.style.top = '50%';
  crosshair.style.left = '50%';
  crosshair.style.transform = 'translate(-50%, -50%)';
  crosshair.style.width = '4px';
  crosshair.style.height = '4px';
  crosshair.style.backgroundColor = 'white';
  crosshair.style.borderRadius = '50%';
  crosshair.style.pointerEvents = 'none';
  crosshair.style.zIndex = '1000';
  crosshair.style.boxShadow = '0 0 3px black';
  document.body.appendChild(crosshair);
  return crosshair;
}

export function createInfoDisplay() {
  const infoDisplay = document.createElement('div');
  infoDisplay.style.position = 'absolute';
  infoDisplay.style.top = '10px';
  infoDisplay.style.left = '10px';
  infoDisplay.style.color = 'white';
  infoDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  infoDisplay.style.padding = '10px';
  infoDisplay.style.fontFamily = 'monospace';
  infoDisplay.style.fontSize = '14px';
  infoDisplay.style.borderRadius = '5px';
  infoDisplay.style.pointerEvents = 'none';
  infoDisplay.style.zIndex = '1000';
  infoDisplay.textContent = 'Click on objects to interact';
  document.body.appendChild(infoDisplay);
  return infoDisplay;
}

export function updateInfoDisplay(infoDisplay, message, temporary = true) {
  infoDisplay.textContent = message;
  
  if (temporary) {
    setTimeout(() => {
      infoDisplay.textContent = 'Click on objects to interact';
    }, 3000);
  }
}

export function showKeyCollected(infoDisplay) {
  updateInfoDisplay(infoDisplay, '🔑 Key added to inventory!', true);
}