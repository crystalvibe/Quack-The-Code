/**
 * MirageOS Terminal Game - Taskbar JavaScript
 * Handles taskbar functionality and interactions
 */

// Initialize taskbar functionality
function initializeTaskbar() {
    // VPN toggle
    document.getElementById('vpn-toggle').addEventListener('click', toggleVPN);
    
    // WiFi panel
    document.getElementById('wifi-panel').addEventListener('click', () => {
        togglePanel('wifi-settings-panel');
    });
    
    // Chat button
    document.getElementById('chat-button').addEventListener('click', () => {
        togglePanel('chat-panel');
        clearNotifications('chat');
    });
    
    // Menu button
    document.getElementById('menu-button').addEventListener('click', () => {
        togglePanel('menu-panel');
    });
    
    // Close panel buttons
    document.querySelectorAll('.close-panel').forEach(button => {
        button.addEventListener('click', () => {
            closeAllPanels();
        });
    });
    
    // WiFi network selection
    document.querySelectorAll('.wifi-network').forEach(network => {
        network.addEventListener('click', (e) => {
            selectWiFiNetwork(e.target.textContent);
        });
    });
    
    // Menu options
    document.getElementById('toggle-crt').addEventListener('click', toggleCRTEffect);
    document.getElementById('help-option').addEventListener('click', showHelpMenu);
    document.getElementById('about-option').addEventListener('click', showAboutInfo);
    
    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.side-panel') && 
            !e.target.closest('.clickable')) {
            closeAllPanels();
        }
    });
}

// Toggle VPN
function toggleVPN() {
    // Only allow toggling if VPN has been set up
    if (gameState.gameProgress === 'local_admin' || 
        gameState.gameProgress === 'company_guest' || 
        gameState.gameProgress === 'company_root') {
        
        gameState.vpnActive = !gameState.vpnActive;
        document.getElementById('vpn-status').textContent = gameState.vpnActive ? 'ON' : 'OFF';
        
        // Show message in terminal
        if (gameState.vpnActive) {
            addToTerminal('VPN connected to MirageTunnel', 'success-text');
        } else {
            addToTerminal('VPN disconnected', 'warning-text');
        }
    } else {
        // VPN not set up yet
        addToTerminal('VPN not configured. Run vpn_setup.sh as root.', 'error-text');
    }
}

// Select WiFi network
function selectWiFiNetwork(networkName) {
    // Update selected network in UI
    document.querySelectorAll('.wifi-network').forEach(network => {
        if (network.textContent === networkName) {
            network.classList.add('selected');
        } else {
            network.classList.remove('selected');
        }
    });
    
    // Update game state
    gameState.wifiNetwork = networkName;
    document.getElementById('wifi-name').textContent = networkName;
    
    // Show message in terminal
    addToTerminal(`Connected to WiFi network: ${networkName}`, 'system-response');
    
    // Close the panel
    closeAllPanels();
    
    // Special case for FBI network
    if (networkName === 'FBI-Surveillance-Van') {
        setTimeout(() => {
            addToTerminal('WARNING: Suspicious network detected!', 'warning-text');
        }, 1000);
    }
}

// Show help menu
function showHelpMenu() {
    const helpText = `
MIRAGE OS TERMINAL HELP
======================

BASIC COMMANDS:
- help: Display this help message
- ls: List directory contents
- cd: Change directory
- cat: View file contents
- pwd: Print working directory
- clear: Clear terminal
- sudo su: Attempt to become root user
- whoami: Show current user
- connect [ip] [user]: Connect to remote server
- decrypt [file]: Decrypt encrypted file
- open [app]: Open application (e.g., chat)

TASKBAR FUNCTIONS:
- VPN Toggle: Enable/disable VPN connection
- WiFi Panel: Change WiFi network
- Chat: Open encrypted chat
- Menu: Access terminal settings

GAME PROGRESSION:
1. Start as local guest user
2. Find root password and elevate to root
3. Access admin directory and set up VPN
4. Connect to company server
5. Find company root password and elevate to root
6. Discover the truth...

Type 'help' at any time to see this message again.
`;
    
    addToTerminal(helpText, 'system-response');
    closeAllPanels();
}

// Show about info
function showAboutInfo() {
    const aboutText = `
ABOUT MIRAGE OS v2.91
====================

MirageOS Terminal Interface
Copyright © 2023 MirageCorp
All rights reserved.

This system is for authorized users only.
Unauthorized access is prohibited and may be prosecuted.

System Information:
- Version: 2.91
- Build: 20230517
- Kernel: MirageKernel 4.8.2
- Security Level: Maximum

For support, contact: admin@miragecorp.net
`;
    
    addToTerminal(aboutText, 'system-response');
    closeAllPanels();
}