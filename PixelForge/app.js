// Global Application State Engine
const state = {
    gridSize: 8,
    pixelSize: 45,
    currentColor: '#1a1a1a',
    currentTool: 'draw', 
    isDrawing: false,
    
    // Animation Track Memory Store
    frames: [
        { id: 1, data: Array(64).fill('#ffffff') }
    ],
    currentFrameId: 1,
    
    // Animation Playback Config
    fps: 8,
    playbackIndex: 0,
    lastFrameTime: 0,

    // Authentic Retro Asset Preset Swatches
    retroSwatches: [
        '#1a1a1a', '#ffffff', '#ff0044', '#00ff66', 
        '#0088ff', '#ffff00', '#ff9900', '#9900ff',
        '#7c0800', '#f8b800', '#00b800', '#0058f8',
        '#e45c10', '#0044ff', '#d800cc', '#000000'
    ]
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
    
    btnAddFrame: document.getElementById('btn-add-frame'),
    btnCloneFrame: document.getElementById('btn-clone-frame'),
    frameStrip: document.getElementById('frame-strip'),
    fpsSlider: document.getElementById('fps-slider'),
    fpsVal: document.getElementById('fps-val'),
    animationRender: document.getElementById('animation-render'),

    codeOutput: document.getElementById('code-output'),
    btnCopy: document.getElementById('btn-copy')
};

// Initialize Application Logic
function initEngine() {
    buildRetroPaletteUI();
    setupEventListeners();
    buildWorkspaceGrid(state.gridSize, false); 
    renderFrameControls();
    generateCodeExportStrings(); 
    requestAnimationFrame(animationLoop); 
}

// Generate Palette Nodes dynamically
function buildRetroPaletteUI() {
    dom.palette.innerHTML = '';
    state.retroSwatches.forEach((color, idx) => {
        const swatchNode = document.createElement('div');
        swatchNode.classList.add('swatch');
        if (idx === 0) swatchNode.classList.add('active-swatch');
        swatchNode.style.backgroundColor = color;
        swatchNode.dataset.color = color;
        dom.palette.appendChild(swatchNode);
    });
}

// Generate the Dynamic Structural Draw Area
function buildWorkspaceGrid(size, resettingState = true) {
    state.gridSize = size;
    state.pixelSize = size === 8 ? 45 : 22; 

    if (resettingState) {
        state.frames = [{ id: Date.now(), data: Array(size * size).fill('#ffffff') }];
        state.currentFrameId = state.frames[0].id;
    }

    document.documentElement.style.setProperty('--grid-rows', size);
    document.documentElement.style.setProperty('--grid-cols', size);
    document.documentElement.style.setProperty('--pixel-size', `${state.pixelSize}px`);

    dom.animationRender.style.width = `${1}px`;
    dom.animationRender.style.height = `${1}px`;
    dom.animationRender.style.transform = size === 8 ? 'scale(30)' : 'scale(15)';

    loadCurrentFrameToWorkspace();
    renderFrameControls();
    generateCodeExportStrings();
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
    
    generateCodeExportStrings();
}

// Compile frame matrix memory states into formatted output code snippets
function generateCodeExportStrings() {
    const size = state.gridSize;
    let outputString = `/**\n * PIXELFORGE MATRIX DATA EXPORT\n * Size: ${size}x${size} // Total Frames: ${state.frames.length}\n */\n\n`;

    outputString += `const SPRITE_DATA = [\n`;
    state.frames.forEach((frame, fIndex) => {
        outputString += `  // Frame ${fIndex + 1}\n  [\n`;
        for (let row = 0; row < size; row++) {
            let rowColors = [];
            for (let col = 0; col < size; col++) {
                const index = (row * size) + col;
                rowColors.push(`"${frame.data[index]}"`);
            }
            outputString += `    [${rowColors.join(', ')}]${row < size - 1 ? ',' : ''}\n`;
        }
        outputString += `  ]${fIndex < state.frames.length - 1 ? ',' : ''}\n`;
    });
    outputString += `];\n\n`;

    outputString += `/* Pure CSS Engine Animation Snippet */\n`;
    outputString += `@keyframes play-sprite {\n`;
    
    const framePercentageStep = 100 / state.frames.length;
    
    state.frames.forEach((frame, fIndex) => {
        const percentageStart = (fIndex * framePercentageStep).toFixed(1);
        const percentageEnd = ((fIndex + 1) * framePercentageStep).toFixed(1);
        
        let shadowArray = [];
        for (let index = 0; index < frame.data.length; index++) {
            const color = frame.data[index];
            if (color === '#ffffff') continue; 
            
            const x = index % size;
            const y = Math.floor(index / size);
            shadowArray.push(`${x}px ${y}px 0 ${color}`);
        }

        const shadowValue = shadowArray.length > 0 ? shadowArray.join(',\n      ') : 'none';
        
        outputString += `  ${percentageStart}% , ${percentageEnd}% {\n`;
        outputString += `    box-shadow:\n      ${shadowValue};\n  }\n`;
    });
    
    outputString += `}`;
    dom.codeOutput.value = outputString;
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
    generateCodeExportStrings();
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

function renderBoxShadowPreview(frameData) {
    let shadowString = '';
    const size = state.gridSize;

    for (let index = 0; index < frameData.length; index++) {
        const color = frameData[index];
        if (color === '#ffffff') continue; 

        const x = index % size;
        const y = Math.floor(index / size);
        shadowString += `${x}px ${y}px 0 ${color},`;
    }

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
        generateCodeExportStrings();
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

    dom.btnAddFrame.addEventListener('click', () => {
        const newFrame = { id: Date.now(), data: Array(state.gridSize * state.gridSize).fill('#ffffff') };
        state.frames.push(newFrame);
        state.currentFrameId = newFrame.id;
        loadCurrentFrameToWorkspace();
        renderFrameControls();
        generateCodeExportStrings();
    });

    dom.btnCloneFrame.addEventListener('click', () => {
        const currentFrame = state.frames.find(f => f.id === state.currentFrameId);
        const duplicatedFrame = { id: Date.now(), data: [...currentFrame.data] };
        state.frames.push(duplicatedFrame);
        state.currentFrameId = duplicatedFrame.id;
        loadCurrentFrameToWorkspace();
        renderFrameControls();
        generateCodeExportStrings();
    });

    dom.fpsSlider.addEventListener('input', (e) => {
        state.fps = Number(e.target.value);
        dom.fpsVal.textContent = state.fps;
        generateCodeExportStrings();
    });

    dom.btnCopy.addEventListener('click', () => {
        dom.codeOutput.select();
        navigator.clipboard.writeText(dom.codeOutput.value).then(() => {
            const currentLabel = dom.btnCopy.textContent;
            dom.btnCopy.textContent = "✓ Copied Successfully!";
            dom.btnCopy.classList.add('active-mode');
            
            setTimeout(() => {
                dom.btnCopy.textContent = currentLabel;
                dom.btnCopy.classList.remove('active-mode');
            }, 1800);
        }).catch(err => {
            console.error('Could not copy matrix output text: ', err);
        });
    });
}

function updateStatusDisplay() {
    dom.statusBar.textContent = `STATUS: Active // Workspace: ${state.gridSize}x${state.gridSize} Matrix // Active Tool: ${state.currentTool.toUpperCase()}`;
}

// Start final runtime execution
initEngine();