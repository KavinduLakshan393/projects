// Global Application State Engine
const state = {
    gridSize: 8,
    pixelSize: 45,
    currentColor: '#000000',
    currentTool: 'draw', 
    isDrawing: false,
    
    // Animation Track Memory Store
    frames: [
        { id: 1, data: Array(64).fill('#ffffff') } // Starts with default 8x8 white frame
    ],
    currentFrameId: 1,
    
    // Animation Playback Config
    fps: 8,
    playbackIndex: 0,
    lastFrameTime: 0
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
    statusBar: document.querySelector('.status-bar'),
    
    // Animation UI Cache hooks
    btnAddFrame: document.getElementById('btn-add-frame'),
    btnCloneFrame: document.getElementById('btn-clone-frame'),
    frameStrip: document.getElementById('frame-strip'),
    fpsSlider: document.getElementById('fps-slider'),
    fpsVal: document.getElementById('fps-val'),
    animationRender: document.getElementById('animation-render')
};

// Initialize Application Logic
function initEngine() {
    setupEventListeners();
    buildWorkspaceGrid(state.gridSize, false); // Initialize grid structure safely
    renderFrameControls();
    requestAnimationFrame(animationLoop); // Launch live render thread
}

// Generate the Dynamic Structural Draw Area
function buildWorkspaceGrid(size, resettingState = true) {
    state.gridSize = size;
    state.pixelSize = size === 8 ? 45 : 22; 

    // Reset frame sequence only if explicitly targeted by workspace layout sizing buttons
    if (resettingState) {
        state.frames = [{ id: Date.now(), data: Array(size * size).fill('#ffffff') }];
        state.currentFrameId = state.frames[0].id;
    }

    // Adapt layout sizes
    document.documentElement.style.setProperty('--grid-rows', size);
    document.documentElement.style.setProperty('--grid-cols', size);
    document.documentElement.style.setProperty('--pixel-size', `${state.pixelSize}px`);

    // Reset preview node relative origin dimensions
    dom.animationRender.style.width = `${1}px`;
    dom.animationRender.style.height = `${1}px`;
    dom.animationRender.style.transform = size === 8 ? 'scale(30)' : 'scale(15)';

    loadCurrentFrameToWorkspace();
    renderFrameControls();
}

// Draw active dataset onto DOM grid nodes
function loadCurrentFrameToWorkspace() {
    dom.grid.innerHTML = '';
    const activeFrame = state.frames.find(f => f.id === state.currentFrameId);

    for (let index = 0; index < state.gridSize * state.gridSize; index++) {
        const pixelNode = document.createElement('div');
        pixelNode.classList.add('pixel-node');
        pixelNode.dataset.index = index;
        pixelNode.style.backgroundColor = activeFrame.data[index];

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
    const activeFrame = state.frames.find(f => f.id === state.currentFrameId);
    
    activeFrame.data[index] = targetColor;
    
    const node = dom.grid.children[index];
    if (node) {
        node.style.backgroundColor = targetColor;
    }
}

// Render out UI indicators matching state items
function renderFrameControls() {
    dom.frameStrip.innerHTML = '';
    state.frames.forEach((frame, index) => {
        const framePill = document.createElement('div');
        framePill.classList.add('frame-pill');
        if (frame.id === state.currentFrameId) framePill.classList.add('active-frame');
        
        framePill.innerHTML = `
            <span>F-${index + 1}</span>
            ${state.frames.length > 1 ? `<span class="delete-frame-btn" data-id="${frame.id}">×</span>` : ''}
        `;

        framePill.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-frame-btn')) {
                e.stopPropagation();
                deleteFrame(Number(e.target.dataset.id));
                return;
            }
            state.currentFrameId = frame.id;
            loadCurrentFrameToWorkspace();
            renderFrameControls();
        });

        dom.frameStrip.appendChild(framePill);
    });
}

function deleteFrame(id) {
    if (state.frames.length <= 1) return;
    const targetIndex = state.frames.findIndex(f => f.id === id);
    state.frames = state.frames.filter(f => f.id !== id);
    
    if (state.currentFrameId === id) {
        state.currentFrameId = state.frames[Math.max(0, targetIndex - 1)].id;
    }
    loadCurrentFrameToWorkspace();
    renderFrameControls();
}

// Centralized Loop Layer utilizing high performance CSS box shadows maps
function animationLoop(timestamp) {
    const interval = 1000 / state.fps;
    const elapsed = timestamp - state.lastFrameTime;

    if (elapsed > interval) {
        state.lastFrameTime = timestamp - (elapsed % interval);
        
        if (state.frames.length > 0) {
            state.playbackIndex = (state.playbackIndex + 1) % state.frames.length;
            const currentPlaybackFrame = state.frames[state.playbackIndex];
            
            if (currentPlaybackFrame) {
                renderBoxShadowPreview(currentPlaybackFrame.data);
            }
        }
    }
    requestAnimationFrame(animationLoop);
}

// Builds the dynamic CSS preview shadow mapping logic
function renderBoxShadowPreview(frameData) {
    let shadowString = '';
    const size = state.gridSize;

    for (let index = 0; index < frameData.length; index++) {
        const color = frameData[index];
        // Skip white / unpainted pixels to optimize render passes
        if (color === '#ffffff') continue; 

        const x = index % size;
        const y = Math.floor(index / size);
        
        shadowString += `${x}px ${y}px 0 ${color},`;
    }

    // Clean up trailing comma string endings safely
    if (shadowString.endsWith(',')) {
        shadowString = shadowString.slice(0, -1);
    }
    
    dom.animationRender.style.boxShadow = shadowString;
}

// Centralized Event Routing
function setupEventListeners() {
    window.addEventListener('mouseup', () => { state.isDrawing = false; });

    dom.btnGrid8.addEventListener('click', () => {
        dom.btnGrid16.classList.remove('active-mode');
        dom.btnGrid8.classList.add('active-mode');
        buildWorkspaceGrid(8, true);
    });

    dom.btnGrid16.addEventListener('click', () => {
        dom.btnGrid8.classList.remove('active-mode');
        dom.btnGrid16.classList.add('active-mode');
        buildWorkspaceGrid(16, true);
    });

    dom.btnClear.addEventListener('click', () => {
        const activeFrame = state.frames.find(f => f.id === state.currentFrameId);
        activeFrame.data.fill('#ffffff');
        loadCurrentFrameToWorkspace();
    });

    dom.toolDraw.addEventListener('click', () => {
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        state.currentTool = 'draw';
        updateStatusDisplay();
    });

    dom.toolErase.addEventListener('click', () => {
        dom.toolDraw.classList.remove('active-tool');
        dom.toolErase.classList.add('active-tool');
        state.currentTool = 'erase';
        updateStatusDisplay();
    });

    dom.palette.addEventListener('click', (e) => {
        const activeSwatch = e.target.closest('.swatch');
        if (!activeSwatch) return;
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active-swatch'));
        activeSwatch.classList.add('active-swatch');
        state.currentColor = activeSwatch.dataset.color;
        dom.colorInput.value = state.currentColor;
        state.currentTool = 'draw';
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        updateStatusDisplay();
    });

    dom.colorInput.addEventListener('input', (e) => {
        state.currentColor = e.target.value;
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active-swatch'));
        state.currentTool = 'draw';
        dom.toolErase.classList.remove('active-tool');
        dom.toolDraw.classList.add('active-tool');
        updateStatusDisplay();
    });

    // Frame Sequencing Event Implementations
    dom.btnAddFrame.addEventListener('click', () => {
        const newFrame = { id: Date.now(), data: Array(state.gridSize * state.gridSize).fill('#ffffff') };
        state.frames.push(newFrame);
        state.currentFrameId = newFrame.id;
        loadCurrentFrameToWorkspace();
        renderFrameControls();
    });

    dom.btnCloneFrame.addEventListener('click', () => {
        const currentFrame = state.frames.find(f => f.id === state.currentFrameId);
        const duplicatedFrame = { id: Date.now(), data: [...currentFrame.data] };
        state.frames.push(duplicatedFrame);
        state.currentFrameId = duplicatedFrame.id;
        loadCurrentFrameToWorkspace();
        renderFrameControls();
    });

    dom.fpsSlider.addEventListener('input', (e) => {
        state.fps = Number(e.target.value);
        dom.fpsVal.textContent = state.fps;
    });
}

function updateStatusDisplay() {
    dom.statusBar.textContent = `STATUS: Active // Workspace: ${state.gridSize}x${state.gridSize} Matrix // Active Tool: ${state.currentTool.toUpperCase()}`;
}

// Start runtime execution thread securely
initEngine();