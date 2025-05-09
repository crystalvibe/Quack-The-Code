/**
 * MirageOS Terminal Game - Game Flow JavaScript
 * Handles game progression, events, and story elements
 */

// Game progression stages
const gameStages = {
    'local_guest': {
        description: 'Starting as local guest user',
        hints: [
            'Try exploring the file system with "ls" and "cd"',
            'Check the contents of files with "cat"',
            'Look for clues about how to gain higher access'
        ]
    },
    'local_root': {
        description: 'Elevated to local root user',
        hints: [
            'You now have access to more directories',
            'Look for the admin directory',
            'Set up VPN for secure connections'
        ]
    },
    'local_admin': {
        description: 'VPN configured, ready to connect externally',
        hints: [
            'Look for connection details in the root directory',
            'Use the "connect" command with the IP address',
            'Make sure VPN is ON before connecting'
        ]
    },
    'company_guest': {
        description: 'Connected to company server as guest',
        hints: [
            'Look for clues to gain higher access',
            'The password might be in your local system',
            'Remember to keep VPN active'
        ]
    },
    'company_root': {
        description: 'Elevated to company root user',
        hints: [
            'You now have access to sensitive logs',
            'Look for encrypted files',
            'Use "decrypt" command on encrypted files'
        ]
    }
};

// Story events that trigger at specific points
const storyEvents = [
    {
        trigger: 'time_played',
        time: 60, // seconds
        event: () => {
            if (gameState.gameProgress === 'local_guest') {
                addToTerminal('\nHINT: Check the /etc/logs directory for useful information.', 'highlight-text');
            }
        }
    },
    {
        trigger: 'file_viewed',
        file: '/etc/logs/root_hint.txt',
        event: () => {
            addToTerminal('\nYou found something interesting! Try "sudo su" with this password.', 'highlight-text');
        }
    },
    {
        trigger: 'progress_change',
        progress: 'local_root',
        event: () => {
            setTimeout(() => {
                addToTerminal('\nNew directories are now accessible. Try exploring /root and /admin', 'highlight-text');
            }, 1000);
        }
    },
    {
        trigger: 'progress_change',
        progress: 'local_admin',
        event: () => {
            setTimeout(() => {
                addToTerminal('\nVPN is now active. Check /root/vault for connection details.', 'highlight-text');
            }, 1000);
        }
    },
    {
        trigger: 'progress_change',
        progress: 'company_guest',
        event: () => {
            setTimeout(() => {
                showNotification('chat', 1);
                addChatMessage('0xFBI', 'You really think this ends with him?');
            }, 3000);
        }
    },
    {
        trigger: 'progress_change',
        progress: 'company_root',
        event: () => {
            setTimeout(() => {
                addToTerminal('\nCheck the logs directory for encrypted files.', 'highlight-text');
            }, 1000);
        }
    }
];

// Initialize game flow
function initializeGameFlow() {
    // Start timer for time-based events
    startEventTimer();
    
    // Set up initial game state
    gameState.gameStartTime = Date.now();
    
    // Add random chat message after a delay
    setTimeout(() => {
        if (gameState.gameProgress === 'local_guest') {
            showNotification('chat', 1);
            addChatMessage('rogue-node @anon', 'He\'s watching. Stop digging.');
        }
    }, 120000); // 2 minutes
}

// Start timer for time-based events
function startEventTimer() {
    setInterval(() => {
        const timePlayedSeconds = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
        
        // Check for time-based events
        storyEvents.forEach(event => {
            if (event.trigger === 'time_played' && 
                timePlayedSeconds >= event.time && 
                !event.triggered) {
                
                event.triggered = true;
                event.event();
            }
        });
    }, 1000);
}

// Check progress and trigger appropriate events
function checkProgressAndTriggerEvents() {
    // Get current progress
    const currentProgress = gameState.gameProgress;
    
    // Check for progress-based events
    storyEvents.forEach(event => {
        if (event.trigger === 'progress_change' && 
            event.progress === currentProgress && 
            !event.triggered) {
            
            event.triggered = true;
            event.event();
        }
    });
    
    // Check for file-viewed events
    if (gameState.discoveredFiles) {
        storyEvents.forEach(event => {
            if (event.trigger === 'file_viewed' && 
                gameState.discoveredFiles.includes(event.file) && 
                !event.triggered) {
                
                event.triggered = true;
                event.event();
            }
        });
    }
}

// Add chat message
function addChatMessage(sender, message) {
    // Add to chat panel
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message-item';
    messageElement.innerHTML = `<span class="chat-sender">${sender}:</span> ${message}`;
    chatMessages.appendChild(messageElement);
    
    // Add to game state
    gameState.chatMessages.push({ sender, message, timestamp: new Date() });
    
    // If chat panel is not open, show notification
    if (!document.getElementById('chat-panel').classList.contains('active')) {
        showNotification('chat');
    }
    
    // Also show in terminal if it's important
    if (sender === 'rogue-node @anon' || sender === '0xFBI') {
        addToTerminal(`\n💬 ${sender}: ${message}`, 'chat-message');
    }
}

// Provide hint based on current progress
function provideHint() {
    const currentStage = gameStages[gameState.gameProgress];
    
    if (currentStage) {
        const randomHint = currentStage.hints[Math.floor(Math.random() * currentStage.hints.length)];
        addToTerminal(`\nHINT: ${randomHint}`, 'highlight-text');
    }
}

// Export functions for other modules
window.checkProgressAndTriggerEvents = checkProgressAndTriggerEvents;
window.addChatMessage = addChatMessage;
window.provideHint = provideHint;