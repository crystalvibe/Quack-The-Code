# Prompt Engineering Documentation

This document outlines the prompts and interactions used with Amazon Q Developer to create the MirageOS Terminal Game.

prompt: 
Design a terminal-based psychological thriller hacking game with realistic Linux terminal behavior and a dark cyberpunk plot. The entire game must simulate a 90s/early-2000s CRT terminal (8/16-bit aesthetic) with realistic command support (e.g., ls, cd, cat, sudo, login, nano, touch, etc.).

🔧 FUNCTIONAL GOALS
- Simulate a 90s CRT terminal with 8/16-bit aesthetic
- Commands mimic authentic Linux behavior
- File system navigable with a typical UNIX structure
- VPN setup and privilege escalation required to progress
- Mistakes (e.g., not connecting to VPN) trigger consequences (FBI trace)
- Reboot animation with system wipe if VPN is not connected

🧠 GAME LORE AND FLOW
You are a hacker trying to expose the crime lord Mirage, using only a decaying terminal interface and fragments of someone else's investigation. You believe you're tracing Mirage—until you realize you're becoming Mirage.

🧩 GAME STEPS & MECHANICS
1. 🔓 GUEST MODE: LOCAL TERMINAL (LINUX SHELL)
Bootscreen:

████████████████████████████████████
██   TERMINAL OS v2.91 - CRT MODE  ██
██   User: guest       Access: ✖   ██
████████████████████████████████████

Player starts in /home/guest
- Type help to list available commands
- Run ls, explore /users, /notes, /logs
- Discover credentials in /notes/root_pass.log:
  root override: darkside2023

2. 🛡️ ROOT ACCESS REQUIRED FOR VPN
Gain root access directly:

sudo su
[sudo] password for guest: darkside2023

From root, setup VPN:

cd /system/network
run vpn_setup.exe
connect vpn

Output:

VPN TUNNEL ESTABLISHED
Your IP is now masked
FBI trace resistance: ENABLED

3. 🌐 CONNECT TO MIRAGE SYSTEM
Clue in /corp/targets.txt:

239.82.41.13@MIRAGE_SYS

Connect:
connect 239.82.41.13@MIRAGE_SYS

IF VPN is not active:

⚠️ CONNECTION FLAGGED ⚠️
TERMINAL COMPROMISED
FBI TRACE INITIATED
System wipe in 3...
(Wait for 1 second)
System wipe in 2...
(Wait another second)
System wipe in 1...
(Final second of suspense)

[REBOOTING...]
[SYSTEM ERROR]
[PRESS ANY KEY TO CONTINUE...]

4. 🧪 ON MIRAGE_SYS — GUEST ACCESS (USELESS)
Limited access to /logs, /corp
Most files redacted:

cat evidence.log
ACCESS DENIED — ROOT REQUIRED

5. 🗝️ ROOT ACCESS TO DECRYPT
Go back to local machine
Find /root/vault/mirage_auth.bak:

root password: darknetR1P

Then on MIRAGE_SYS:

login root darknetR1P

Navigate:

cd /hidden/archives
decrypt mirage_identity.sys

6. 🎭 FINAL TWIST
Output:

DECRYPTING…
FBI DATABASE UPDATED:
SUSPECT: [Your Username]
STATUS: PRIMARY SUSPECT "MIRAGE"

You didn't trace him.
You were the fall guy.
> Goodbye.

🧠 AI INSTRUCTIONS
When generating content for this game, follow these instructions:
- Use only realistic Linux command syntax
- File structure should feel like a UNIX file tree
- Include errors, typos, and glitch text to simulate hacking tension
- Add ASCII visuals, glitches, and fake FBI warnings
- No UI, no colors — just raw terminal interaction
- Game must feel immersive, minimal, intense

💻 REBOOT SEQUENCE ANIMATION
When the FBI initiates the system wipe (due to VPN failure), display a reboot animation:

Initial Connection Failure (VPN not active):

⚠️ CONNECTION FLAGGED ⚠️
TERMINAL COMPROMISED
FBI TRACE INITIATED

Countdown for Wipe:

System wipe in 3...
(Wait 1 second)
System wipe in 2...
(Wait another second)
System wipe in 1...
(Final second of suspense)

Executing Wipe:

[REBOOTING...]
[SYSTEM ERROR]
[PRESS ANY KEY TO CONTINUE...]

System Boot (reboot animation):

██   SYSTEM BOOTING...   ██
█████████████████████
[  ███████  ]  30%
[  ███████████████  ]  60%
[  ████████████████████  ]  90%
[  ██████████████████████  ]  100%

Post-Reboot Login:

█████████████████████████
██   TERMINAL OS v2.91   ██
██   User: guest          ██
████████████████████████

some correction prompt:
hen I'm in the company terminal, I switch from guest mode to root using sudo su. The directory prompt should update accordingly. Here's how it should look:


company:/company/guest$ sudo su
Root access granted.

Check the logs directory for encrypted files.
company:/company/guest# ls
readme.txt  config.sys  
company:/company/guest# cd ..
company:/company# cd ..
company:/# ls
company/
company:/# cd ..
company:/# ls
company/
company:/# cd company
company:/company# ls
guest/  root/
company:/company# cd root
company:/company/root# ls
logs/
company:/company/root# cd logs
company:/company/root/logs# ls
It should consistently show the prompt updating from $ to # when switching to root, and the directory path should reflect each location properly—just like how a regular Linux terminal behaves when navigating directories.