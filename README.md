# MirageOS - Terminal-Based Psychological Hacking Game

A terminal-based psychological thriller hacking simulation game where you navigate through different access levels while uncovering a twisted plot.

## 🎮 Game Overview

MirageOS is an immersive terminal-based game that simulates a hacking experience with a psychological twist. The game features:

- Authentic terminal interface with command-line interactions
- Progressive access flow: local guest → local root → local admin → company guest → company root
- Clickable taskbar with functional UI elements (VPN toggle, WiFi panel, chat)
- Psychological elements and plot twists
- "NOOO I SHOULDN'T HAVE DONE THAT" moment when connecting without VPN
- Old CRT terminal aesthetic with flicker effects

## 🚀 How to Play

1. Open `index.html` in a modern web browser
2. Interact with the terminal by typing commands
3. Use the taskbar elements to toggle VPN, change WiFi, or access chat
4. Follow the hints and progress through the game
5. Uncover the truth about your identity

## 📋 Basic Commands

- `help` - Show available commands
- `ls` - List directory contents
- `cd [directory]` - Change directory
- `cat [file]` - View file contents
- `pwd` - Print working directory
- `clear` - Clear terminal screen
- `sudo su` - Attempt to become root user (requires password)
- `whoami` - Display current user
- `./vpn_setup.sh` - Set up VPN (when in the right directory as root)
- `connect [IP] [user]` - Connect to remote server
- `decrypt [file]` - Decrypt encrypted files

## 🔍 Game Progression

1. Start as local guest user
2. Find the root password in system logs
3. Elevate to root and access admin directory
4. Set up VPN for secure connections
5. Connect to the company server
6. Find company root password and elevate privileges
7. Discover the shocking truth about your identity

## 💻 Technical Details

### File Structure
```
.
├── index.html          # Main game interface
├── css/
│   ├── main.css       # General styling
│   └── terminal.css   # Terminal-specific styling
└── js/
    ├── main.js        # Core game initialization and utilities
    ├── terminal.js    # Terminal emulation and file system
    ├── taskbar.js     # Taskbar functionality
    ├── game-flow.js   # Game progression logic
    └── chat.js        # Chat system implementation
```

### Key Features
- **Virtual File System**: Complete simulation of a Unix-like file system with directories, files, and permissions
- **User Authentication**: Multi-level user authentication system with different access privileges
- **Network Simulation**: Simulated network connectivity with VPN and WiFi functionality
- **UI Components**: 
  - Realistic terminal emulation with command history
  - Interactive taskbar with system utilities
  - CRT screen effect with customizable intensity
  - Real-time clock display
  - Chat system with notifications

### Technical Implementation
- Built with vanilla JavaScript for optimal performance
- Custom terminal emulation engine
- Event-driven architecture for real-time interactions
- Simulated file system with proper permission handling
- Encrypted file system for sensitive data
- Dynamic UI updates with DOM manipulation
- Custom CSS effects for CRT display simulation

## 🎭 The Twist

You think you're tracing a criminal... but you're being framed into becoming them. The game progressively reveals that your actions are being monitored and manipulated, leading to a shocking revelation about your true identity.

## 🔒 Security Features

- Simulated VPN protection
- Network security warnings
- FBI trace detection system
- Encrypted file system
- Permission-based access control
- Secure connection requirements

---

Created as a terminal-based psychological hacking simulation game. Enjoy the journey of discovery and deception!

## 🛠 Development

### Requirements
- Modern web browser with JavaScript enabled
- No additional dependencies required
- Local web server recommended for testing

### Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
