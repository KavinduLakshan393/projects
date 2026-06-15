// Global Application State Engine
const state = {
    gridSize: 8,
    pixelSize: 45,
    currentColor: '#000000',
    currentTool: 'draw', // 'draw' | 'erase'
    isDrawing: false,
    // Active frame memory buffer (flat array representing hex values)
    canvasData: []
};

// DOM Cache Elements
const dom = {
    grid: document.getElementById('pixel-grid'),
    btnGrid8: document.getElementById('btn-grid-8'),
    btnGrid16: document.getElementById('btn-grid-16'),
    btnClear: document.getElementById('btn-clear'),
    toolDraw: document.getElementById('tool-draw'),
    toolErase: document.getElementById('tool-erase'),
    palette: document.getElementById('palette'),
    colorInput: document.getElementById('color-input'),
    statusBar: document.querySelector('.status-bar')
};

// Initialize Application Logic
function initEngine() {
    setupEventListeners();
    buildWorkspaceGrid(state.gridSize);
}

// Generate the Dynamic Structural Draw Area
function buildWorkspaceGrid(size) {
    state.gridSize = size;
    state.pixelSize = size === 8 ? 45 : 22; // Scale node dimensions based on resolution
    state.canvasData = Array(size * size).fill('#ffffff'); // Initialize flat white background state

    // Update CSS root variables globally
    document.documentElement.style.setProperty('--grid-rows', size);
    document.documentElement.style.setProperty('--grid-cols', size);
    document.documentElement.style.setProperty('--pixel-size', `${state.pixelSize}px`);

    dom.grid.innerHTML = '';

    // Generate individual pixel elements programmatically
    for (let index = 0; index < size * size; index++) {
        const pixelNode = document.createElement('div');
        pixelNode.classList.add('pixel-node');
        pixelNode.dataset.index = index;
        pixelNode.style.backgroundColor = '#ffffff';

        // Bind high-performance interaction events
        pixelNode.addEventListener('mousedown', (e) => handlePixelAction(e, index));
        pixelNode.addEventListener('mouseenter', (e) => handlePixelDrag(e, index));

        dom.grid.appendChild(pixelNode);
    }
    updateStatusDisplay();
}

// Track Individual Input Actions
function handlePixelAction(event, index) {
    event.preventDefault();
    state.isDrawing = true;
    applyColorToNode(index);
}

function handlePixelDrag(event, index) {
    if (!state.isDrawing) return;
    applyColorToNode(index);
}

// Modify Matrix State and Paint Screen
function applyColorToNode(index) {
    const targetColor = state.currentTool === 'draw' ? state.currentColor : '#ffffff';
    state.canvasData[index] = targetColor;
    
    const node = dom.grid.children[index];
    if (node) {
        node.style.backgroundColor = targetColor;
    }
}

// Centralized Event Routing
function setupEventListeners() {
    // Global mouse hook to prevent painting stickiness when lifting click outside the viewport
    window.addEventListener('mouseup', () => {
        state.isDrawing = false;
    });

    // Grid Dimensions Toggles
    dom.btnGrid8.addEventListener('click', () => {
        dom.btnGrid16.classList.remove('active-mode');
        dom.btnGrid8.classList.add('active-mode');
        buildWorkspaceGrid(8);
    });

    dom.btnGrid16.addEventListener('click', () => {
        dom.btnGrid8.classList.remove('active-mode');
        dom.btnGrid16.classList.add('active-mode');
        buildWorkspaceGrid(16);
    });

    // Canvas Eraser & Wipe Commands
    dom.btnClear.addEventListener('click', () => {
        buildWorkspaceGrid(state.gridSize);
    });

    dom.toolDraw.addEventListener('click', () => {
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        state.currentTool = 'draw';
    });

    dom.toolErase.addEventListener('click', () => {
        dom.toolDraw.classList.remove('active-tool');
        dom.toolErase.classList.add('active-tool');
        state.currentTool = 'erase';
    });

    // Native Color Selection Processing
    dom.palette.addEventListener('click', (e) => {
        const activeSwatch = e.target.closest('.swatch');
        if (!activeSwatch) return;

        // Reset previous active indicators
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active-swatch'));
        activeSwatch.classList.add('active-swatch');

        state.currentColor = activeSwatch.dataset.color;
        dom.colorInput.value = state.currentColor;
        
        // Auto-switch back to pencil tool on palette selection swap
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        state.currentTool = 'draw';
    });

    dom.colorInput.addEventListener('input', (e) => {
        state.currentColor = e.target.value;
        // Strip custom selections of active layout highlights
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active-swatch'));
        
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        state.currentTool = 'draw';
    });
}

// Standard UI Matrix Updates
function updateStatusDisplay() {
    dom.statusBar.textContent = `STATUS: Active // Workspace: ${state.gridSize}x${state.gridSize} Matrix // Active Tool: ${state.currentTool.toUpperCase()}`;
}

// Start runtime
initEngine();