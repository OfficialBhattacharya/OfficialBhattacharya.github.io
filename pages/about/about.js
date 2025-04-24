// Cyberpunk About Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initTerminalEffects();
    initHologramDisks();
    initCyberCatTracking();
    initHexSkillMatrix();
    initStatBoxEffects();
    addScanLines();
});

// Initialize terminal effects with typing animation
function initTerminalEffects() {
    // Terminal blinking cursor
    const cursor = document.querySelector('.blink-cursor');
    if (cursor) {
        setInterval(() => {
            cursor.textContent = cursor.textContent === '_' ? '' : '_';
        }, 500);
    }
    
    // Add CRT flicker effect to the terminal
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        setInterval(() => {
            // Random chance to trigger a flicker
            if (Math.random() < 0.1) {
                terminalWindow.classList.add('crt-flicker');
                setTimeout(() => {
                    terminalWindow.classList.remove('crt-flicker');
                }, 150);
            }
        }, 5000);
    }
    
    // Simulate typing effect for terminal title (neofetch)
    const terminalTitle = document.querySelector('.terminal-title');
    if (terminalTitle) {
        const originalText = terminalTitle.textContent;
        terminalTitle.textContent = 'diganta@linux:~$ ';
        
        let i = 0;
        const neofetchText = 'neofetch';
        const typeInterval = setInterval(() => {
            if (i < neofetchText.length) {
                terminalTitle.textContent += neofetchText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
    
    // Add terminal highlight effects on hover
    const termItems = document.querySelectorAll('.term-data-list > li');
    termItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const label = item.querySelector('.term-label');
            if (label) {
                label.style.textShadow = '0 0 10px rgba(255, 0, 127, 0.7)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const label = item.querySelector('.term-label');
            if (label) {
                label.style.textShadow = '0 0 5px rgba(255, 0, 127, 0.5)';
            }
        });
    });
}

// Add scan lines to terminal window
function addScanLines() {
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        const scanLine = document.createElement('div');
        scanLine.classList.add('scan-line');
        terminalBody.appendChild(scanLine);
    }
}

// Initialize hologram disk animations
function initHologramDisks() {
    // Add functionality for stat boxes
    const statValues = document.querySelectorAll('.stat-value');
    
    // Animate stat values with counting effect
    statValues.forEach(statValue => {
        const finalValue = parseInt(statValue.textContent);
        statValue.textContent = '0';
        
        let currentValue = 0;
        const interval = setInterval(() => {
            if (currentValue < finalValue) {
                currentValue++;
                statValue.textContent = currentValue + '+';
            } else {
                clearInterval(interval);
            }
        }, 100);
    });
}

// Initialize cyber cat eye tracking
function initCyberCatTracking() {
    // Wait for SVG to load
    const cyberCat = document.querySelector('.cyber-cat-svg');
    
    if (cyberCat) {
        cyberCat.addEventListener('load', () => {
            const svgDoc = cyberCat.contentDocument;
            
            if (svgDoc) {
                const leftEye = svgDoc.querySelector('.cat-pupil-left');
                const rightEye = svgDoc.querySelector('.cat-pupil-right');
                
                if (leftEye && rightEye) {
                    // Track mouse movement for eye tracking
                    document.addEventListener('mousemove', (e) => {
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;
                        
                        // Get cat position
                        const catRect = cyberCat.getBoundingClientRect();
                        const catCenterX = catRect.left + catRect.width / 2;
                        const catCenterY = catRect.top + catRect.height / 2;
                        
                        // Calculate angle between mouse and cat
                        const angle = Math.atan2(mouseY - catCenterY, mouseX - catCenterX);
                        
                        // Maximum eye movement in pixels
                        const maxMove = 3;
                        
                        // Calculate eye positions
                        const moveX = Math.cos(angle) * maxMove;
                        const moveY = Math.sin(angle) * maxMove;
                        
                        // Update eye positions
                        leftEye.setAttribute('cx', 133 + moveX);
                        leftEye.setAttribute('cy', 107 + moveY);
                        rightEye.setAttribute('cx', 173 + moveX);
                        rightEye.setAttribute('cy', 107 + moveY);
                    });
                    
                    // Animate circuit tail on hover
                    const circuitTail = svgDoc.querySelector('.circuit-tail');
                    if (circuitTail) {
                        cyberCat.addEventListener('mouseover', () => {
                            // Trigger more intense pulse animation on hover
                            circuitTail.style.filter = 'url(#cyber-glow) drop-shadow(0 0 5px #00ff9d)';
                            circuitTail.style.strokeWidth = '3';
                        });
                        
                        cyberCat.addEventListener('mouseout', () => {
                            // Reset to normal state
                            circuitTail.style.filter = 'url(#cyber-glow)';
                            circuitTail.style.strokeWidth = '2';
                        });
                    }
                }
            }
        });
        
        // Status label update with terminal-like text appearance
        const statusLabel = document.querySelector('.cat-status-label');
        if (statusLabel) {
            // Simulate status updates with typing effect
            const statuses = [
                'SYSTEM: OPERATIONAL',
                'SCANNING: ENVIRONMENT',
                'ANALYSIS: COMPLETE',
                'STATUS: OPTIMAL'
            ];
            
            let statusIndex = 0;
            setInterval(() => {
                statusIndex = (statusIndex + 1) % statuses.length;
                const newStatus = statuses[statusIndex];
                
                // Clear current text
                statusLabel.textContent = '';
                statusLabel.style.opacity = '1';
                
                // Add typing effect
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i < newStatus.length) {
                        statusLabel.textContent += newStatus.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }, 5000);
        }
    }
}

// Initialize hex skill matrix interactions
function initHexSkillMatrix() {
    const hexCells = document.querySelectorAll('.hex-cell');
    
    hexCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            // Show skill description
            const skill = cell.getAttribute('data-skill');
            const content = cell.querySelector('.hex-content');
            
            // Store original content
            cell.setAttribute('data-original', content.textContent);
            
            // Expand with skill name
            content.textContent = skill;
            content.style.fontSize = '0.65rem';
            
            // Add glow effect
            cell.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.7)';
        });
        
        cell.addEventListener('mouseleave', () => {
            // Restore original content
            const originalContent = cell.getAttribute('data-original');
            const content = cell.querySelector('.hex-content');
            
            content.textContent = originalContent;
            content.style.fontSize = '0.8rem';
            
            // Remove glow effect
            cell.style.boxShadow = '';
        });
        
        // Add click interaction
        cell.addEventListener('click', () => {
            // Create a pulse effect
            const pulse = document.createElement('div');
            pulse.style.position = 'absolute';
            pulse.style.width = '100%';
            pulse.style.height = '100%';
            pulse.style.backgroundColor = 'var(--cyber-green)';
            pulse.style.opacity = '0.3';
            pulse.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            pulse.style.animation = 'hexPulse 0.6s forwards';
            
            cell.appendChild(pulse);
            
            // Clean up after animation
            setTimeout(() => {
                pulse.remove();
            }, 600);
        });
    });
}

// Initialize stat box interactions
function initStatBoxEffects() {
    const statBoxes = document.querySelectorAll('.stat-box');
    if (statBoxes.length > 0) {
        statBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                const statValue = box.querySelector('.stat-value');
                if (statValue) {
                    statValue.style.textShadow = '0 0 20px var(--cyber-green), 0 0 30px var(--cyber-green)';
                    statValue.style.transform = 'scale(1.1)';
                    statValue.style.transition = 'all 0.3s ease';
                }
            });
            
            box.addEventListener('mouseleave', () => {
                const statValue = box.querySelector('.stat-value');
                if (statValue) {
                    statValue.style.textShadow = '0 0 10px rgba(0, 255, 157, 0.5)';
                    statValue.style.transform = 'scale(1)';
                }
            });
        });
    }
} 