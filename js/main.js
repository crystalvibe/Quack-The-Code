/**
 * MirageOS Terminal Game - Main JavaScript
 * @file Main initialization and global utilities for the MirageOS terminal game
 * @author MirageCorp
 * @version 2.91
 */

/**
 * Global game state object containing all runtime game data
 * @type {Object}
 */
const gameState = {
    currentUser: 'guest',
    currentHost: 'local',
    currentDirectory: '/home/guest',
    vpnActive: false,
    wifiNetwork: 'MirageNet',
    crtEffectEnabled: true,
    gameProgress: 'local_guest', // Tracks progression: local_guest, local_root, local_admin, company_guest, company_root
    discoveredCommands: [],
    discoveredFiles: [],
    chatMessages: [],
    pendingNotifications: 0
};

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTerminal();
    initializeTaskbar();
    initializeGameFlow();
    initializeChat();
    updateClock();
    
    // Apply CRT effect by default
    document.body.classList.add('crt-effect-strong');
    
    // Welcome message
    displayWelcomeMessage();
});

/**
 * Updates the clock display in the taskbar
 * Updates every minute with current system time
 */
function updateClock() {
    const clockElement = document.getElementById('clock');
    
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Format hours and minutes with leading zeros
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        clockElement.textContent = `${hours}:${minutes}`;
    }
    
    // Update immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
}

/**
 * Displays the initial welcome message and ASCII art logo
 */
function displayWelcomeMessage() {
    const asciiLogo = `
    ███╗   ███╗██╗██████╗  █████╗  ██████╗ ███████╗ ██████╗ ███████╗
    ████╗ ████║██║██╔══██╗██╔══██╗██╔════╝ ██╔════╝██╔═══██╗██╔════╝
    ██╔████╔██║██║██████╔╝███████║██║  ███╗█████╗  ██║   ██║███████╗
    ██║╚██╔╝██║██║██╔══██╗██╔══██║██║   ██║██╔══╝  ██║   ██║╚════██║
    ██║ ╚═╝ ██║██║██║  ██║██║  ██║╚██████╔╝███████╗╚██████╔╝███████║
    ╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝
                                                        v2.91
    `;
    
    const welcomeText = `
Welcome to MirageOS Terminal v2.91
Copyright © 2023 MirageCorp. All rights reserved.

Type 'help' for a list of available commands.
`;
    
    addToTerminal(asciiLogo, 'ascii-art');
    
    // Add welcome text with typing effect
    const terminalOutput = document.getElementById('terminal-output');
    const welcomeElement = document.createElement('div');
    welcomeElement.className = 'terminal-text system-response typing-effect';
    welcomeElement.textContent = welcomeText;
    terminalOutput.appendChild(welcomeElement);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/**
 * Adds text content to the terminal output
 * @param {string} text - The text to add to the terminal
 * @param {string} [className='system-response'] - CSS class for styling the output
 * @returns {HTMLElement} The newly created terminal line element
 */
function addToTerminal(text, className = 'system-response') {
    const terminalOutput = document.getElementById('terminal-output');
    const newLine = document.createElement('div');
    newLine.className = `terminal-text ${className}`;
    newLine.textContent = text;
    terminalOutput.appendChild(newLine);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    return newLine;
}

/**
 * Adds HTML content to the terminal output
 * @param {string} html - The HTML content to add to the terminal
 * @param {string} [className='system-response'] - CSS class for styling the output
 * @returns {HTMLElement} The newly created terminal line element
 */
function addHTMLToTerminal(html, className = 'system-response') {
    const terminalOutput = document.getElementById('terminal-output');
    const newLine = document.createElement('div');
    newLine.className = `terminal-text ${className}`;
    newLine.innerHTML = html;
    terminalOutput.appendChild(newLine);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    return newLine;
}

/**
 * Updates the terminal prompt based on current user and directory
 */
function updatePrompt() {
    const promptElement = document.getElementById('prompt');
    let promptText = '';
    
    if (gameState.currentHost === 'local') {
        if (gameState.currentUser === 'root') {
            promptText = `${gameState.currentDirectory}# `;
        } else {
            promptText = `${gameState.currentDirectory}$ `;
        }
    } else if (gameState.currentHost === 'company') {
        if (gameState.currentUser === 'root') {
            promptText = `company:${gameState.currentDirectory}# `;
        } else {
            promptText = `company:${gameState.currentDirectory}$ `;
        }
    }
    
    promptElement.textContent = promptText;
}

/**
 * Toggles the visibility of a side panel (chat, wifi, menu)
 * @param {string} panelId - The ID of the panel to toggle
 */
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const allPanels = document.querySelectorAll('.side-panel');
    
    // Close all panels first
    allPanels.forEach(p => p.classList.remove('active'));
    
    // Toggle the selected panel
    if (panel) {
        panel.classList.toggle('active');
    }
}

/**
 * Closes all open side panels
 */
function closeAllPanels() {
    const allPanels = document.querySelectorAll('.side-panel');
    allPanels.forEach(p => p.classList.remove('active'));
}

/**
 * Toggles the CRT screen effect
 */
function toggleCRTEffect() {
    document.body.classList.toggle('crt-effect-strong');
    gameState.crtEffectEnabled = document.body.classList.contains('crt-effect-strong');
}

/**
 * Shows a notification in the taskbar
 * @param {string} type - The type of notification ('chat')
 * @param {number} [count=1] - Number of notifications to add
 */
function showNotification(type, count = 1) {
    if (type === 'chat') {
        const chatNotification = document.getElementById('chat-notification');
        gameState.pendingNotifications += count;
        chatNotification.textContent = `${gameState.pendingNotifications} msg`;
        
        // Make it blink
        chatNotification.classList.add('blink');
        
        // Optional: Play a notification sound
        // playNotificationSound();
    }
}

/**
 * Clears notifications of a specific type
 * @param {string} type - The type of notification to clear ('chat')
 */
function clearNotifications(type) {
    if (type === 'chat') {
        const chatNotification = document.getElementById('chat-notification');
        gameState.pendingNotifications = 0;
        chatNotification.textContent = '0 msg';
        chatNotification.classList.remove('blink');
    }
}

/**
 * Simulates typing effect for text output
 * @param {HTMLElement} element - The element to apply the typing effect to
 * @param {string} text - The text to type
 * @param {number} [speed=30] - Typing speed in milliseconds per character
 * @returns {Promise} Resolves when typing is complete
 */
function simulateTyping(element, text, speed = 30) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

// Play FBI warning animation
function playFBIWarning() {
    const terminalOutput = document.getElementById('terminal-output');
    
    // Clear terminal
    terminalOutput.innerHTML = '';
    
    const warningElement = document.createElement('div');
    warningElement.className = 'terminal-text fbi-warning';
    terminalOutput.appendChild(warningElement);
    
    simulateTyping(warningElement, '> WARNING: UNSECURED CONNECTION', 50)
        .then(() => {
            const traceElement = document.createElement('div');
            traceElement.className = 'terminal-text fbi-warning';
            terminalOutput.appendChild(traceElement);
            return simulateTyping(traceElement, '> TRACE DETECTED BY FBI', 50);
        })
        .then(() => {
            const countdownElement = document.createElement('div');
            countdownElement.className = 'terminal-text fbi-warning';
            terminalOutput.appendChild(countdownElement);
            return simulateTyping(countdownElement, '> System lockdown in:', 50);
        })
        .then(() => {
            return new Promise(resolve => {
                let countdown = 3;
                
                function tick() {
                    if (countdown > 0) {
                        addToTerminal(`[${countdown}]...`, 'fbi-warning');
                        countdown--;
                        setTimeout(tick, 1000);
                    } else {
                        resolve();
                    }
                }
                
                tick();
            });
        })
        .then(() => {
            addToTerminal('', 'system-response');
            addToTerminal('>> INITIATING WIPE <<', 'self-destruct');
            addToTerminal('>> TERMINAL SELF-DESTRUCT <<', 'self-destruct');
            
            setTimeout(() => {
                addToTerminal('>> REBOOTING...', 'self-destruct');
                
                // Reboot after a delay
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }, 2000);
        });
}

// Create data transfer effect with streaming data
function createDataTransferEffect(username) {
    const overlay = document.createElement('div');
    overlay.className = 'data-transfer-active';
    
    // Create the main transfer text
    const transferText = document.createElement('div');
    transferText.textContent = `TRANSFERRING DATA TO YOUR COMPUTER`;
    overlay.appendChild(transferText);
    
    // Add progress text
    const progressText = document.createElement('div');
    progressText.className = 'transfer-progress';
    overlay.appendChild(progressText);
    
    // Create multiple data streams
    for (let i = 0; i < 30; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.animationDuration = `${0.5 + Math.random() * 1.5}s`;
        stream.style.animationDelay = `${Math.random() * 2}s`;
        stream.textContent = generateRandomDataStream();
        overlay.appendChild(stream);
    }
    
    document.body.appendChild(overlay);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressText.textContent = `Progress: ${Math.floor(progress)}%`;
    }, 200);
    
    return overlay;
}

// Generate random data stream text
function generateRandomDataStream() {
    const chars = '01';
    return Array.from({length: 50}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Show FBI alert
function showFBIAlert() {
    const alertScreen = document.createElement('div');
    alertScreen.className = 'fbi-alert-screen';
    
    const warningText = document.createElement('div');
    warningText.className = 'fbi-alert-text';
    warningText.textContent = '! FBI WARNING !';
    alertScreen.appendChild(warningText);
    
    const subText = document.createElement('div');
    subText.className = 'fbi-alert-text';
    subText.style.fontSize = '36px';
    subText.textContent = 'UNAUTHORIZED ACCESS DETECTED';
    alertScreen.appendChild(subText);
    
    const locationText = document.createElement('div');
    locationText.className = 'fbi-alert-text';
    locationText.style.fontSize = '24px';
    locationText.textContent = 'LOCATION: [TRACED]';
    alertScreen.appendChild(locationText);
    
    document.body.appendChild(alertScreen);
    
    // Add alarm sound effect
    const alarmSound = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
    alarmSound.play();
    
    return alertScreen;
}

// Show final Mirage message
function showMirageMessage() {
    const messageScreen = document.createElement('div');
    messageScreen.className = 'mirage-message';
    
    const messages = [
        "Congratulations...",
        "You've become what you sought to destroy",
        "Welcome to the other side",
        "- The Real Mirage"
    ];
    
    messages.forEach((text, index) => {
        setTimeout(() => {
            const textElement = document.createElement('div');
            textElement.className = 'mirage-text';
            textElement.style.animationDelay = `${index * 0.5}s`;
            textElement.textContent = text;
            messageScreen.appendChild(textElement);
        }, index * 1000);
    });
    
    document.body.appendChild(messageScreen);
    return messageScreen;
}

// Trigger the final sequence
function triggerFinalSequence(username) {
    return new Promise((resolve) => {
        // Start data transfer effect
        const transferOverlay = createDataTransferEffect(username);
        
        // After 3 seconds, show FBI alert
        setTimeout(() => {
            transferOverlay.remove();
            const fbiAlert = showFBIAlert();
            
            // After 5 seconds, show final Mirage message
            setTimeout(() => {
                fbiAlert.remove();
                const mirageMessage = showMirageMessage();
                
                // Remove final message after 8 seconds
                setTimeout(() => {
                    mirageMessage.remove();
                    resolve();
                }, 8000);
            }, 5000);
        }, 3000);
    });
}

// Export functions and gameState for other modules
window.gameState = gameState;
window.addToTerminal = addToTerminal;
window.addHTMLToTerminal = addHTMLToTerminal;
window.updatePrompt = updatePrompt;
window.togglePanel = togglePanel;
window.closeAllPanels = closeAllPanels;
window.toggleCRTEffect = toggleCRTEffect;
window.showNotification = showNotification;
window.clearNotifications = clearNotifications;
window.simulateTyping = simulateTyping;
window.playFBIWarning = playFBIWarning;