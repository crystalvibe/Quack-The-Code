/**
 * MirageOS Terminal Game - Chat JavaScript
 * Handles chat functionality and interactions
 */

// Initialize chat functionality
function initializeChat() {
    // Set up initial chat messages
    setupInitialChatMessages();
    
    // Add chat input functionality (optional)
    setupChatInput();
}

// Set up initial chat messages
function setupInitialChatMessages() {
    const chatMessages = document.getElementById('chat-messages');
    
    // System welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chat-message-item';
    welcomeMessage.innerHTML = '<span class="chat-sender">SYSTEM:</span> Welcome to MirageNet Encrypted Chatroom';
    chatMessages.appendChild(welcomeMessage);
    
    // Add to game state
    gameState.chatMessages.push({ 
        sender: 'SYSTEM', 
        message: 'Welcome to MirageNet Encrypted Chatroom', 
        timestamp: new Date() 
    });
}

// Set up chat input functionality (optional)
function setupChatInput() {
    // Create chat input element
    const chatPanel = document.getElementById('chat-panel');
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <input type="text" id="chat-message-input" placeholder="Type your message...">
        <button id="chat-send-button">Send</button>
    `;
    chatPanel.appendChild(chatInput);
    
    // Add event listeners
    const messageInput = document.getElementById('chat-message-input');
    const sendButton = document.getElementById('chat-send-button');
    
    // Send button click
    sendButton.addEventListener('click', () => {
        sendChatMessage();
    });
    
    // Enter key press
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Send chat message
function sendChatMessage() {
    const messageInput = document.getElementById('chat-message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        // Add user message
        addChatMessage('You', message);
        
        // Clear input
        messageInput.value = '';
        
        // Process message and generate response
        processChatMessage(message);
    }
}

// Process chat message and generate response
function processChatMessage(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Delayed response
    setTimeout(() => {
        // Check for keywords and respond accordingly
        if (lowerMessage.includes('help') || lowerMessage.includes('hint')) {
            addChatMessage('SYSTEM', 'I cannot provide direct assistance. Try exploring the system.');
        }
        else if (lowerMessage.includes('password') || lowerMessage.includes('root')) {
            addChatMessage('rogue-node @anon', 'Careful what you ask for in this channel. They\'re watching.');
        }
        else if (lowerMessage.includes('fbi') || lowerMessage.includes('trace')) {
            addChatMessage('0xFBI', 'This channel is being monitored.');
        }
        else if (lowerMessage.includes('vpn') || lowerMessage.includes('secure')) {
            addChatMessage('rogue-node @anon', 'Always use protection when connecting. You never know who\'s watching.');
        }
        else if (lowerMessage.includes('mirage') || lowerMessage.includes('identity')) {
            addChatMessage('rogue-node @anon', 'Identities are fluid in the digital realm. Who are you really?');
        }
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            addChatMessage('rogue-node @anon', 'I shouldn\'t be talking to you. But I\'m curious about your progress.');
        }
        else {
            // Random responses for other messages
            const randomResponses = [
                'Interesting. Keep digging.',
                'I can\'t help you with that directly.',
                'Some secrets are better left undiscovered.',
                'The truth is hidden in plain sight.',
                'Be careful what you wish for.',
                'They\'re watching. Always watching.'
            ];
            
            const randomSender = Math.random() > 0.7 ? '0xFBI' : 'rogue-node @anon';
            const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
            
            addChatMessage(randomSender, randomResponse);
        }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Trigger special chat events based on game progress
function triggerChatEvent(eventType) {
    switch (eventType) {
        case 'warning':
            addChatMessage('rogue-node @anon', 'You\'re getting too close. They\'ll notice soon.');
            break;
        case 'discovery':
            addChatMessage('rogue-node @anon', 'You found it. Now you understand why they want you.');
            break;
        case 'betrayal':
            addChatMessage('0xFBI', 'Target identified. Proceed with caution.');
            break;
        case 'final_warning':
            addChatMessage('rogue-node @anon', 'This is your last chance to turn back.');
            break;
    }
}