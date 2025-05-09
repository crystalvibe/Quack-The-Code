/**
 * MirageOS Terminal Game - Terminal JavaScript
 * @file Handles terminal commands and file system simulation
 * @author MirageCorp
 * @version 2.91
 */

/**
 * Virtual file system structure for local machine
 * Simulates a Unix-like file system with directories, files, and permissions
 * @type {Object}
 */
const fileSystem = {
    '/': {
        type: 'directory',
        children: {
            'home': {
                type: 'directory',
                children: {
                    'guest': {
                        type: 'directory',
                        children: {
                            'notes.txt': {
                                type: 'file',
                                content: 'welcome_user = "guest"\ntry: sudo su',
                                permissions: 'rw-r--r--'
                            },
                            'hint.log': {
                                type: 'file',
                                content: 'Remember to check system logs for important information.',
                                permissions: 'rw-r--r--'
                            }
                        },
                        permissions: 'rwxr-xr-x'
                    }
                },
                permissions: 'rwxr-xr-x'
            },
            'etc': {
                type: 'directory',
                children: {
                    'logs': {
                        type: 'directory',
                        children: {
                            'root_hint.txt': {
                                type: 'file',
                                content: 'root_pass = "gr1tcore42"',
                                permissions: 'rw-r--r--'
                            }
                        },
                        permissions: 'rwxr-xr-x'
                    }
                },
                permissions: 'rwxr-xr-x'
            },
            'admin': {
                type: 'directory',
                hidden: true, // Only visible after becoming root
                children: {
                    'network': {
                        type: 'directory',
                        children: {
                            'vpn_setup.sh': {
                                type: 'file',
                                executable: true,
                                content: '#!/bin/bash\n# VPN Setup Script\necho "> VPN connected to MirageTunnel"\necho "> IP spoof active"',
                                permissions: 'rwxr-xr-x'
                            },
                            'trace_blocker.pkg': {
                                type: 'file',
                                content: 'Use a VPN, or else the FBI will catch you.\n ./vpn_setup.sh <-maybe try this',
                                permissions: 'rw-r--r--'
                            }
                        },
                        permissions: 'rwxr-xr-x'
                    }
                },
                permissions: 'rwxr-x---'
            },
            'root': {
                type: 'directory',
                hidden: true, // Only visible after becoming root
                children: {
                    'vault': {
                        type: 'directory',
                        children: {
                            'mirage_auth.bak': {
                                type: 'file',
                                content: 'root_pass: darknetR1P',
                                permissions: 'rw-------'
                            },
                            'targets.txt': {
                                type: 'file',
                                content: '[ connect 239.82.41.13 **@MIRAGE_SYS** ]',
                                permissions: 'rw-------'
                            }
                        },
                        permissions: 'rwx------'
                    }
                },
                permissions: 'rwx------'
            }
        },
        permissions: 'rwxr-xr-x'
    }
};

/**
 * Virtual file system structure for company server
 * Separate file system accessed when connecting to remote server
 * @type {Object}
 */
const companyFileSystem = {
    '/': {
        type: 'directory',
        children: {
            'company': {
                type: 'directory',
                children: {
                    'guest': {
                        type: 'directory',
                        children: {
                            'readme.txt': {
                                type: 'file',
                                content: 'To access admin logs, run: sudo su',
                                permissions: 'rw-r--r--'
                            },
                            'config.sys': {
                                type: 'file',
                                content: 'System configuration file. Do not modify unless authorized.',
                                permissions: 'rw-r--r--'
                            }
                        },
                        permissions: 'rwxr-xr-x'
                    },
                    'root': {
                        type: 'directory',
                        hidden: true, // Only visible after becoming company root
                        children: {
                            'logs': {
                                type: 'directory',
                                children: {
                                    'mirage_identity.sys': {
                                        type: 'file',
                                        encrypted: true,
                                        content: '[ FBI DATABASE LOG ]\n> CODENAME: MIRAGE\n> STATUS: ACTIVE THREAT',
                                        permissions: 'rw-------'
                                    }
                                },
                                permissions: 'rwx------'
                            }
                        },
                        permissions: 'rwx------'
                    }
                },
                permissions: 'rwxr-xr-x'
            }
        },
        permissions: 'rwxr-xr-x'
    }
};

/**
 * Initializes terminal functionality
 * Sets up event listeners and initial terminal state
 */
function initializeTerminal() {
    const commandInput = document.getElementById('command-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Set initial prompt
    updatePrompt();
    
    // Focus on command input
    commandInput.focus();
    
    // Handle command input
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const command = commandInput.value.trim();
            
            // Add command to terminal output
            addToTerminal(`${document.getElementById('prompt').textContent}${command}`, 'user-command');
            
            // Process command
            if (command) {
                processCommand(command);
            }
            
            // Clear input
            commandInput.value = '';
        }
    });
    
    // Keep focus on command input when clicking on terminal
    document.getElementById('terminal-container').addEventListener('click', () => {
        commandInput.focus();
    });
}

/**
 * Processes terminal commands
 * @param {string} command - The command to process
 */
function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    
    // Basic commands
    switch (cmd) {
        case 'help':
            showHelp();
            break;
        case 'ls':
            listDirectory(args[1]);
            break;
        case 'cd':
            changeDirectory(args[1]);
            break;
        case 'cat':
            viewFile(args[1]);
            break;
        case 'pwd':
            printWorkingDirectory();
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'sudo':
            handleSudo(args.slice(1));
            break;
        case 'whoami':
            showCurrentUser();
            break;
        case './vpn_setup.sh':
            executeVpnSetup();
            break;
        case 'connect':
            connectToServer(args.slice(1).join(' '));
            break;
        case 'decrypt':
            decryptFile(args[1]);
            break;
        case 'open':
            openApplication(args[1]);
            break;
        default:
            addToTerminal(`Command not found: ${cmd}`, 'error-text');
    }
}

/**
 * Shows help message with available commands
 */
function showHelp() {
    const helpText = `
Available commands:
  help                 - Show this help message
  ls [directory]       - List directory contents
  cd [directory]       - Change directory
  cat [file]           - View file contents
  pwd                  - Print working directory
  clear                - Clear terminal
  sudo [command]       - Execute command as superuser
  whoami              - Show current user
  connect [ip] [user]  - Connect to remote server
  decrypt [file]       - Decrypt encrypted files
  open [application]   - Open system applications
`;
    addToTerminal(helpText);
}

// List directory contents
function listDirectory(dirPath) {
    const currentFS = gameState.currentHost === 'local' ? fileSystem : companyFileSystem;
    const path = resolvePath(dirPath || gameState.currentDirectory);
    const node = getNodeAtPath(path, currentFS);
    
    if (!node || node.type !== 'directory') {
        addToTerminal(`ls: cannot access '${path}': No such directory`, 'error-text');
        return;
    }
    
    // Check if user has permission to list directory
    if (!checkPermission(node, 'r', gameState.currentUser)) {
        addToTerminal(`ls: cannot open directory '${path}': Permission denied`, 'error-text');
        return;
    }
    
    const entries = Object.entries(node.children);
    
    if (entries.length === 0) {
        addToTerminal('Directory is empty.', 'system-response');
        return;
    }
    
    let output = '';
    
    // Custom order for directories: home, etc, root, admin
    const customOrder = ['home', 'etc', 'root', 'admin'];
    
    // First add directories in custom order
    customOrder.forEach(dirName => {
        if (node.children[dirName] && (!node.children[dirName].hidden || gameState.currentUser === 'root')) {
            output += `<span class="directory-text">${dirName}/</span>  `;
        }
    });
    
    // Then add any remaining entries that aren't in the custom order
    entries.forEach(([name, item]) => {
        // Skip hidden files/directories for non-root users
        if (item.hidden && gameState.currentUser !== 'root') {
            return;
        }
        
        // Skip entries that are already in our custom order
        if (customOrder.includes(name)) {
            return;
        }
        
        if (item.type === 'directory') {
            output += `<span class="directory-text">${name}/</span>  `;
        } else if (item.executable) {
            output += `<span class="executable-text">${name}*</span>  `;
        } else {
            output += `<span class="file-text">${name}</span>  `;
        }
    });
    
    addHTMLToTerminal(output, 'system-response');
}

// Change directory
function changeDirectory(dirPath) {
    if (!dirPath) {
        // Default to home directory if no path provided
        if (gameState.currentHost === 'local') {
            gameState.currentDirectory = `/home/${gameState.currentUser}`;
        } else {
            gameState.currentDirectory = `/company/${gameState.currentUser}`;
        }
        updatePrompt();
        return;
    }
    
    const currentFS = gameState.currentHost === 'local' ? fileSystem : companyFileSystem;
    const path = resolvePath(dirPath);
    const node = getNodeAtPath(path, currentFS);
    
    if (!node || node.type !== 'directory') {
        addToTerminal(`cd: ${dirPath}: No such directory`, 'error-text');
        return;
    }
    
    // Check if user has permission to access directory
    if (!checkPermission(node, 'x', gameState.currentUser)) {
        addToTerminal(`cd: ${dirPath}: Permission denied`, 'error-text');
        return;
    }
    
    gameState.currentDirectory = path;
    updatePrompt();
}

// View file contents
function viewFile(filePath) {
    if (!filePath) {
        addToTerminal('cat: missing file operand', 'error-text');
        return;
    }
    
    const currentFS = gameState.currentHost === 'local' ? fileSystem : companyFileSystem;
    const path = resolvePath(filePath);
    const node = getNodeAtPath(path, currentFS);
    
    if (!node) {
        addToTerminal(`cat: ${filePath}: No such file or directory`, 'error-text');
        return;
    }
    
    if (node.type !== 'file') {
        addToTerminal(`cat: ${filePath}: Is a directory`, 'error-text');
        return;
    }
    
    // Check if user has permission to read file
    if (!checkPermission(node, 'r', gameState.currentUser)) {
        addToTerminal(`cat: ${filePath}: Permission denied`, 'error-text');
        return;
    }
    
    // Check if file is encrypted
    if (node.encrypted) {
        addToTerminal(`cat: ${filePath}: File is encrypted. Use 'decrypt' command.`, 'warning-text');
        return;
    }
    
    addToTerminal(node.content, 'file-text');
    
    // Track discovered files for game progression
    if (!gameState.discoveredFiles.includes(path)) {
        gameState.discoveredFiles.push(path);
        checkGameProgression();
    }
}

// Print working directory
function printWorkingDirectory() {
    addToTerminal(gameState.currentDirectory, 'system-response');
}

// Clear terminal
function clearTerminal() {
    document.getElementById('terminal-output').innerHTML = '';
}

// Handle sudo command
function handleSudo(args) {
    if (args.length === 0) {
        addToTerminal('sudo: no command specified', 'error-text');
        return;
    }
    
    if (args[0] === 'su') {
        // Attempt to become root
        if (gameState.currentHost === 'local') {
            // Local system
            const password = prompt('[sudo] password for ' + gameState.currentUser + ':');
            
            if (password === 'gr1tcore42') {
                gameState.currentUser = 'root';
                gameState.gameProgress = 'local_root';
                updatePrompt();
                addToTerminal('Root access granted.', 'success-text');
                
                // Trigger game progression
                checkGameProgression();
            } else {
                addToTerminal('> ACCESS DENIED', 'error-text');
            }
        } else {
            // Company system
            const password = prompt('[sudo] password for ' + gameState.currentUser + ':');
            
            if (password === 'darknetR1P') {
                gameState.currentUser = 'root';
                gameState.gameProgress = 'company_root';
                updatePrompt();
                addToTerminal('Root access granted.', 'success-text');
                
                // Trigger game progression and final twist
                checkGameProgression();
            } else {
                addToTerminal('> ACCESS DENIED', 'error-text');
            }
        }
    } else {
        // Other sudo commands
        addToTerminal(`sudo: command not found: ${args.join(' ')}`, 'error-text');
    }
}

// Show current user
function showCurrentUser() {
    addToTerminal(gameState.currentUser, 'system-response');
}

// Execute VPN setup script
function executeVpnSetup() {
    const currentPath = gameState.currentDirectory;
    
    if (currentPath !== '/admin/network' && currentPath !== '/admin/network/') {
        addToTerminal('./vpn_setup.sh: No such file or directory', 'error-text');
        return;
    }
    
    if (gameState.currentUser !== 'root') {
        addToTerminal('./vpn_setup.sh: Permission denied', 'error-text');
        return;
    }
    
    // Execute VPN setup
    addToTerminal('> VPN connected to MirageTunnel', 'success-text');
    addToTerminal('> IP spoof active', 'success-text');
    
    // Update game state
    gameState.vpnActive = true;
    gameState.gameProgress = 'local_admin';
    
    // Update taskbar
    document.getElementById('vpn-status').textContent = 'ON';
    
    // Trigger game progression
    checkGameProgression();
}

// Connect to server
function connectToServer(serverInfo) {
    if (!serverInfo.includes('239.82.41.13')) {
        addToTerminal(`connect: Invalid server address`, 'error-text');
        return;
    }
    
    // Check if VPN is active
    if (!gameState.vpnActive) {
        // Trigger FBI warning and game over
        playFBIWarning();
        return;
    }
    
    // Connect to company server
    addToTerminal('> Connected to MirageCorp Terminal (guest mode)', 'success-text');
    
    // Update game state
    gameState.currentHost = 'company';
    gameState.currentUser = 'guest';
    gameState.currentDirectory = '/company/guest';
    gameState.gameProgress = 'company_guest';
    
    // Update prompt
    updatePrompt();
    
    // Trigger game progression
    checkGameProgression();
}

// Decrypt file
function decryptFile(filePath) {
    if (!filePath) {
        addToTerminal('decrypt: missing file operand', 'error-text');
        return;
    }
    
    const currentFS = gameState.currentHost === 'local' ? fileSystem : companyFileSystem;
    const path = resolvePath(filePath);
    const node = getNodeAtPath(path, currentFS);
    
    if (!node) {
        addToTerminal(`decrypt: ${filePath}: No such file or directory`, 'error-text');
        return;
    }
    
    if (node.type !== 'file') {
        addToTerminal(`decrypt: ${filePath}: Is a directory`, 'error-text');
        return;
    }
    
    if (!node.encrypted) {
        addToTerminal(`decrypt: ${filePath}: File is not encrypted`, 'error-text');
        return;
    }
    
    // Check if user has permission to read file
    if (!checkPermission(node, 'r', gameState.currentUser)) {
        addToTerminal(`decrypt: ${filePath}: Permission denied`, 'error-text');
        return;
    }
    
    // Decrypt file
    addToTerminal('Decrypting file...', 'system-response');
    setTimeout(() => {
        addToTerminal(node.content, 'highlight-text');
        
        // If this is the final file, trigger the final twist
        if (path === '/company/root/logs/mirage_identity.sys') {
            triggerFinalTwist();
        }
    }, 1500);
}

// Open application
function openApplication(appName) {
    if (!appName) {
        addToTerminal('open: missing application name', 'error-text');
        return;
    }
    
    if (appName.toLowerCase() === 'chat') {
        togglePanel('chat-panel');
        clearNotifications('chat');
    } else {
        addToTerminal(`open: ${appName}: application not found`, 'error-text');
    }
}

// Resolve path (handle relative paths)
function resolvePath(path) {
    if (!path) return gameState.currentDirectory;
    
    // Absolute path
    if (path.startsWith('/')) {
        return path;
    }
    
    // Parent directory
    if (path === '..') {
        const parts = gameState.currentDirectory.split('/');
        parts.pop();
        return parts.join('/') || '/';
    }
    
    // Current directory
    if (path === '.') {
        return gameState.currentDirectory;
    }
    
    // Relative path
    return `${gameState.currentDirectory === '/' ? '' : gameState.currentDirectory}/${path}`;
}

// Get node at path
function getNodeAtPath(path, fileSystemObj) {
    if (path === '/') return fileSystemObj['/'];
    
    const parts = path.split('/').filter(p => p);
    let current = fileSystemObj['/'];
    
    for (const part of parts) {
        if (!current.children || !current.children[part]) {
            return null;
        }
        current = current.children[part];
    }
    
    return current;
}

// Check file/directory permissions
function checkPermission(node, permission, user) {
    if (user === 'root') return true; // Root has all permissions
    
    const permissions = node.permissions || 'rwxr-xr-x';
    
    // User permissions (owner)
    if (user === '') {
        if (permission === 'r' && permissions[0] === 'r') return true;
        if (permission === 'w' && permissions[1] === 'w') return true;
        if (permission === 'x' && permissions[2] === 'x') return true;
    }
    
    // Others permissions
    if (permission === 'r' && permissions[6] === 'r') return true;
    if (permission === 'w' && permissions[7] === 'w') return true;
    if (permission === 'x' && permissions[8] === 'x') return true;
    
    return false;
}

// Trigger the final twist
function triggerFinalTwist() {
    // Clear terminal first
    document.getElementById('terminal-output').innerHTML = '';
    
    setTimeout(() => {
        // Show chat notification
        showNotification('chat', 1);
        
        // Add message to chat
        addChatMessage('rogue-node @anon', 'You weren\'t tracing him.');
        
        setTimeout(() => {
            addChatMessage('rogue-node @anon', 'You were becoming him.');
            
            setTimeout(() => {
                addChatMessage('rogue-node @anon', 'Welcome to your new identity.');
                
                // Start the data transfer and FBI alert sequence
                triggerFinalSequence(gameState.currentUser)
                    .then(() => {
                        // Add final laugh from the real Mirage
                        const laughMessage = 'Haha, so funny. Such a stupid person, thinking you could trace me. Now enjoy, the FBI’s coming for your crime... Wait, no. It’s my crime. It was a trap all along. Welcome to Mirage’s game.';
                        addToTerminal(laughMessage, 'highlight-text');
                        
                        // Disable further input
                        document.getElementById('command-input').disabled = true;
                        document.body.classList.add('game-over');
                    });
            }, 2000);
        }, 2000);
    }, 3000);
}

// Check game progression
function checkGameProgression() {
    // This function will be implemented in game-flow.js
    if (typeof checkProgressAndTriggerEvents === 'function') {
        checkProgressAndTriggerEvents();
    }
}

