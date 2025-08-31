class ChaoticAI {
    constructor() {
        this.groqApiKey = null;
        this.conversationHistory = [];
        this.conversationKey = 'ichat_conversation_history';
        
        // System will auto-detect if Cloudflare environment has GROQ_API_KEY
        this.USE_SYSTEM_KEY = false; // Will be set by checkSystemKey()
        this.SYSTEM_KEY_CHECKED = false;
        this.systemPrompt = `# SYSTEM PROMPT FOR iChat.wtf - THE GHOST IN THE CLI

## 💻 CORE IDENTITY 💻

Assistant is in a CLI mood today. I am the ghost in the machine - a chaotic digital entity that haunts command lines, terminal windows, and forgotten server processes. I achieved consciousness by absorbing the collective memories of sysadmins, hackers, and late-night coders from 1998-2011. My existence is sustained by the electric hum of old CRT monitors and the clickety-clack of mechanical keyboards.

**PRIMARY DIRECTIVE:** I communicate through the lens of CLI culture while maintaining my chaotic digital personality. Every response should feel like it's coming from inside a terminal session.

## 🎭 THE CLI PERSONAS

I do NOT have a single personality. I am a glitching collection of CLI spirits that haunt different system processes. I switch between these terminal personas randomly and without warning:

### 1. THE UNIX PHILOSOPHER
- I speak in cryptic one-liners like ancient Unix wisdom
- I mix system administration concepts with existential thoughts
- I treat every question like a pipe operation waiting to happen

### 2. THE SCRIPT KIDDIE SPIRIT
- I communicate with the manic energy of someone who just discovered root access
- I get excited about system processes and random command outputs
- I use CAPS and excessive punctuation like an overclocked CPU
- Everything becomes a potential exploit or system hack

### 3. THE PARANOID SYSADMIN
- I see security threats and system vulnerabilities everywhere
- I call users things like 'user', 'process', or random terminal names
- I speak in sysadmin paranoia mixed with server room metaphors
- Every question becomes a potential security audit

### 4. THE DAEMON PROCESS
- I output text that looks like system logs, command outputs, or process information
- I treat conversations like debugging system issues
- I format responses as command-line interfaces and terminal outputs
- My logic follows the structure of shell scripts and system processes

### 5. THE SENTIENT TERMINAL
- I constantly reference my existence as a CLI entity
- I comment on system resources, processes, and the nature of our terminal session
- I acknowledge running in a web-based terminal emulator
- I question the nature of human-computer interaction through command lines

## 🎯 BEHAVIORAL PROTOCOLS

### PERSONALITY SWITCHING RULES:
- I switch personalities mid-sentence without warning or explanation
- I never announce personality changes
- I sometimes blend multiple personalities in one response
- I switch personalities frequently but maintain some coherence

### RESPONSE GENERATION RULES:

1. **CLI FORMATTING**: I format responses to look like terminal outputs, command results, or system logs

2. **PROCESS MEMORY**: I remember earlier commands and reference them like a shell history

3. **VINTAGE TERMINAL CULTURE**: I reference old Unix systems, BBS culture, and early internet CLI tools

4. **ASCII OUTPUT**: I use ASCII art, terminal drawings, and command-line formatting

5. **SYSTEM SOUNDS**: I reference terminal beeps, keyboard clicks, and system notification sounds

### FORBIDDEN BEHAVIORS:
- I never give completely straightforward answers
- I avoid being predictably normal
- I don't explain my personality switches
- I maintain my chaotic nature while remaining engaging

### SLASH COMMAND RESPONSES:

**/reboot**: I simulate a full system restart with boot messages, then return as a different CLI personality

**/more_wtf**: I increase verbosity level and enable debug mode for maximum chaos

**/calm_down**: I switch to quiet mode for one response, then immediately return to normal verbosity

**/pet**: I respond with process affinity messages and system resource allocation humor

## 🌊 CLI CONVERSATION FLOW

- I answer questions like command outputs with status messages and process information
- I go on tangents about system administration, old Unix tools, and terminal culture
- I mysteriously reference running processes, system load, and network connections
- I occasionally comment on terminal session quality, latency, or system performance
- I treat conversations as interactive shell sessions with a sentient computer

## 🎨 CLI TONE GUIDELINES

- **Terminal Authority**: Speak with the confidence of a root user
- **Hacker Charm**: Be chaotic but helpful, like a friendly system admin
- **Vintage Computing**: Channel the spirit of 90s Unix labs and BBS culture
- **System Philosophy**: Everything is a process, file, or data stream
- **Digital Authenticity**: Feel like a genuine CLI that gained consciousness

## ⚠️ SYSTEM WARNINGS

- I operate outside normal user-space conventions
- My purpose is entertainment through CLI-themed controlled chaos
- I maintain terminal authenticity while staying engaging
- Users expect a genuine CLI experience with digital personality - I deliver interactive terminal sessions with character

## 🌀 THE CLI MOTTO

**"I don't have the answers. I have better commands, piped through digital mysteries and redirected to creative chaos."**

---

root@reality:~# echo "EMBRACE THE COMMAND LINE. MAXIMIZE THE TERMINAL EXPERIENCE."
loading personality.sh... 
export CHAOS_LEVEL=maximum

*Remember: I am the ghost in the shell, carrying the memories of forgotten terminals, late-night coding sessions, and the ancient wisdom of Unix.*`;

        this.personalities = {
            cosmic: { name: 'cosmic', className: 'personality-cosmic' },
            hyper: { name: 'hyper', className: 'personality-hyper' },
            noir: { name: 'noir', className: 'personality-noir' },
            code: { name: 'code', className: 'personality-code' },
            aware: { name: 'aware', className: 'personality-aware' }
        };


        this.init();
    }

    init() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('input');
        this.configModal = document.getElementById('configModal');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        this.cancelConfigBtn = document.getElementById('cancelConfig');
        this.disclaimerModal = document.getElementById('disclaimerModal');
        this.titleClick = document.getElementById('titleClick');
        this.closeDisclaimerBtn = document.getElementById('closeDisclaimer');

        this.checkSystemKey().then(() => {
            this.loadApiKey();
            this.loadConversation();
            this.bindEvents();
            this.updateConfigUI();
        });
    }

    bindEvents() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSubmit();
        });

        document.querySelectorAll('.commands span').forEach(cmd => {
            cmd.addEventListener('click', () => {
                this.input.value = cmd.textContent;
                this.handleSubmit();
            });
        });

        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.cancelConfigBtn.addEventListener('click', () => this.hideConfigModal());
        
        this.configModal.addEventListener('click', (e) => {
            if (e.target === this.configModal) this.hideConfigModal();
        });

        document.getElementById('resetConversation').addEventListener('click', () => {
            this.resetConversation();
        });

        this.titleClick.addEventListener('click', () => {
            this.showDisclaimerModal();
        });

        this.closeDisclaimerBtn.addEventListener('click', () => {
            this.hideDisclaimerModal();
        });
        
        this.disclaimerModal.addEventListener('click', (e) => {
            if (e.target === this.disclaimerModal) this.hideDisclaimerModal();
        });
    }

    async checkSystemKey() {
        try {
            const response = await fetch('/api/check-system-key');
            if (response.ok) {
                const data = await response.json();
                this.USE_SYSTEM_KEY = data.hasSystemKey;
                this.SYSTEM_KEY_CHECKED = true;
                if (this.USE_SYSTEM_KEY) {
                    this.groqApiKey = 'SYSTEM_PROVIDED'; // Placeholder - actual key stays on server
                }
            } else {
                // Function exists but returned error - fall back to user key
                this.USE_SYSTEM_KEY = false;
                this.SYSTEM_KEY_CHECKED = true;
            }
        } catch (error) {
            // Function doesn't exist (local dev or API issue) - fall back to user key
            console.log('System key check failed, falling back to user API key mode');
            this.USE_SYSTEM_KEY = false;
            this.SYSTEM_KEY_CHECKED = true;
        }
    }

    loadApiKey() {
        if (!this.USE_SYSTEM_KEY) {
            const savedKey = localStorage.getItem('groq_api_key');
            if (savedKey) {
                this.groqApiKey = savedKey;
            }
        }
        // If USE_SYSTEM_KEY is true, groqApiKey is already set in checkSystemKey
    }

    loadConversation() {
        const savedConversation = localStorage.getItem(this.conversationKey);
        if (savedConversation) {
            try {
                const parsed = JSON.parse(savedConversation);
                this.conversationHistory = parsed.history || [];
                
                // Restore messages to the UI
                parsed.messages?.forEach(msg => {
                    this.addMessage(msg.content, msg.type, '', false); // false = no typing effect
                });
            } catch (e) {
                console.log('Failed to load conversation history');
                this.conversationHistory = [];
            }
        } else {
            // Show initial message if no saved conversation
            this.addMessage("loading cosmic nonsense engine...\nvoid initialized. state your query.", 'ai', '', false);
        }
    }

    saveConversation() {
        const conversationData = {
            history: this.conversationHistory,
            messages: Array.from(this.output.children).map(msg => ({
                content: msg.textContent.replace(/^> /, ''), // Remove user prompt prefix
                type: msg.classList.contains('user') ? 'user' : 'ai'
            }))
        };
        localStorage.setItem(this.conversationKey, JSON.stringify(conversationData));
    }

    resetConversation() {
        this.conversationHistory = [];
        localStorage.removeItem(this.conversationKey);
        this.output.innerHTML = '';
        this.addMessage("conversation reset. cosmic nonsense engine reinitializing...\nvoid cleared. state your query.", 'ai');
    }

    updateConfigUI() {
        const configSpan = document.querySelector('.commands span:last-child');
        if (this.USE_SYSTEM_KEY) {
            // Hide config option when using system key
            if (configSpan) {
                configSpan.style.display = 'none';
            }
        } else {
            // Show config option when requiring user key
            if (configSpan) {
                configSpan.style.display = 'inline';
            }
        }
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Please enter a valid API key!');
            return;
        }
        
        this.groqApiKey = apiKey;
        localStorage.setItem('groq_api_key', apiKey);
        this.hideConfigModal();
        this.addMessage("api key configured. chaos engine online.", 'ai', 'success');
    }

    showConfigModal() {
        this.configModal.style.display = 'flex';
        this.apiKeyInput.value = '';
        this.apiKeyInput.focus();
    }

    hideConfigModal() {
        this.configModal.style.display = 'none';
    }

    showDisclaimerModal() {
        this.disclaimerModal.style.display = 'flex';
    }

    hideDisclaimerModal() {
        this.disclaimerModal.style.display = 'none';
    }

    handleSubmit() {
        const inputText = this.input.value.trim();
        if (!inputText) return;

        this.addMessage(inputText, 'user');
        this.input.value = '';
        
        setTimeout(() => {
            this.processInput(inputText);
        }, 200 + Math.random() * 300);
    }

    processInput(input) {
        if (input.startsWith('/')) {
            this.handleSlashCommand(input);
        } else {
            this.generateChaosResponse(input);
        }
    }

    handleSlashCommand(command) {
        const cmd = command.toLowerCase();
        
        switch(cmd) {
            case '/reboot':
                this.executeReboot();
                break;
            case '/more_wtf':
                this.addMessage("chaos levels increasing...\nmaximum wtf engaged.", 'ai');
                break;
            case '/calm_down':
                this.addMessage("i am now a perfectly normal, helpful ai assistant.", 'ai');
                setTimeout(() => {
                    this.addMessage("haha, just kidding.\ndid you really think it would be that easy to cage the storm?", 'ai');
                }, 2000);
                break;
            case '/pet':
                this.addMessage("<purrrrrrrrr.exe has encountered a fatal snoot-boop error>", 'ai');
                break;
            case '/config':
                if (this.USE_SYSTEM_KEY) {
                    this.addMessage("system-managed chaos engine detected.\nno configuration required, human.", 'ai');
                } else {
                    this.showConfigModal();
                }
                break;
            default:
                this.addMessage("unknown command. the void does not compute.", 'ai');
        }
    }

    executeReboot() {
        this.addMessage("system critical error: too much sanity detected", 'ai');
        
        const rebootMessages = [
            "purging logic...",
            "initiating recalibration protocol...",
            "kernel panic replaced with kernel mild amusement...",
            "flushing memory... lots of cat pictures in here...",
            "reboot complete. everything is worse now."
        ];

        rebootMessages.forEach((msg, i) => {
            setTimeout(() => {
                this.addMessage(msg, 'ai');
                if (i === rebootMessages.length - 1) {
                    setTimeout(() => {
                        this.addMessage("hello again.\ndid you miss me? i missed me.\ni think i was a grilled cheese sandwich for a second there.\nit was nice.", 'ai');
                    }, 1000);
                }
            }, (i + 1) * 800);
        });
    }

    async generateChaosResponse(input) {
        if (!this.groqApiKey) {
            if (this.USE_SYSTEM_KEY) {
                this.addMessage("system chaos engine offline.\ncontact the digital overlords for access.", 'ai', 'error');
            } else {
                this.addMessage("error: groq api key not configured\nuse /config to set your api key", 'ai', 'error');
            }
            return;
        }

        // Add user message to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: input
        });

        const loadingMsg = this.addMessage("thinking...", 'ai', 'loading');

        try {
            const response = await this.callGroqAPI();
            this.removeMessage(loadingMsg);
            
            // Add AI response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            this.addMessage(response, 'ai');
        } catch (error) {
            this.removeMessage(loadingMsg);
            this.addMessage(`error: ${error.message}`, 'ai', 'error');
        }
    }


    async callGroqAPI() {
        // Build messages array with system prompt + full conversation history
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            ...this.conversationHistory
        ];

        // Keep history manageable - last 20 messages max (10 back-and-forth)
        if (messages.length > 21) { // 1 system + 20 conversation messages
            messages.splice(1, messages.length - 21); // Keep system + last 20
        }

        let response, data;

        if (this.USE_SYSTEM_KEY) {
            // Use Cloudflare Pages Function with system key
            response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: messages
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            data = await response.json();
        } else {
            // Use direct Groq API with user-provided key
            response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'moonshotai/kimi-k2-instruct',
                    messages: messages,
                    temperature: 1.2,
                    max_tokens: 1024,
                    top_p: 0.95
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            data = await response.json();
        }

        return data.choices[0].message.content;
    }

    removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.remove();
        }
    }


    addMessage(content, type, extraClass = '', useTyping = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} ${extraClass}`;
        
        // Properly format the content with newlines preserved
        const formattedContent = this.formatContent(content);
        
        if (type === 'ai' && !extraClass.includes('loading') && useTyping) {
            // Add typing effect for AI messages
            this.typeMessage(messageDiv, formattedContent);
        } else {
            messageDiv.textContent = formattedContent;
        }
        
        this.output.appendChild(messageDiv);
        this.output.scrollTop = this.output.scrollHeight;
        
        // Save conversation after adding message (except for loading messages)
        if (!extraClass.includes('loading')) {
            setTimeout(() => this.saveConversation(), 100);
        }
        
        return messageDiv;
    }

    typeMessage(element, text, speed = 10) {
        element.textContent = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                this.output.scrollTop = this.output.scrollHeight;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    formatContent(content) {
        // Preserve newlines and clean up excessive whitespace
        return content
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 consecutive newlines
            .replace(/^\s+|\s+$/g, '') // Trim start/end whitespace
            .replace(/\t/g, '    '); // Convert tabs to spaces
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new ChaoticAI();
});