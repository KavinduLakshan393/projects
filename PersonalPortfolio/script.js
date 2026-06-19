// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const toggleIcon = themeToggle.querySelector('.toggle-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateToggleIcon('light');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    const theme = isDarkMode ? 'dark' : 'light';
    
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Update toggle icon
    updateToggleIcon(isDarkMode ? 'light' : 'dark');
});

// Update toggle icon based on current theme
function updateToggleIcon(nextTheme) {
    toggleIcon.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
}

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="mailto:"], a[href^="http"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Slight ripple effect before navigation
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        ripple.style.pointerEvents = 'none';
    });
});

// Add keyboard accessibility
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});
