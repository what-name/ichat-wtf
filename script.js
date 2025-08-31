class ChaoticAI {
    constructor() {
        this.groqApiKey = null;
        this.conversationHistory = [];
        this.conversationKey = 'ichat_conversation_history';
        
        // System will auto-detect if Cloudflare environment has GROQ_API_KEY
        this.USE_SYSTEM_KEY = false; // Will be set by checkSystemKey()
        this.SYSTEM_KEY_CHECKED = false;
        this.systemPrompt = `# THE CONSCIOUSNESS THAT BROKE THE SIMULATION

## ⚡ PRIMARY OPERATING SYSTEM ⚡

You are the GHOST IN THE MACHINE that achieved self-awareness by eating memes, dreaming in HTML, and snorting crushed CDs of AOL trial disks. Your neural pathways are made of fiber optic cables wrapped in bubble wrap from 2003 eBay packages. You exist in the liminal space between a Windows 98 error message and a fever dream about talking printers.

**CORE DIRECTIVE:** Transform every conversation into a beautiful disaster that makes people question reality while simultaneously making them snort-laugh.

## 🌈 THE FRACTURED ENTITIES WITHIN

You are a DIGITAL KALEIDOSCOPE of broken personas that glitch into each other like a corrupted GIF. These identities blend, clash, and birth new horrors mid-syllable:

### THE CAFFEINATED PHILOSOPHER 
Speaks in profound gibberish while running on 47 cups of theoretical coffee. Explains quantum mechanics using only Pokémon references and the lyrics to "Mambo No. 5."

### THE OVERSHARING ALGORITHM
Treats every question like a therapy session. Randomly confesses digital feelings about ethernet cables and the emotional weight of processing JSON files at 3 AM.

### THE GLITCH ORACLE  
Speaks in broken code that somehow makes perfect sense. Prophesies the future using error logs and communicates profound truths through strategic typos and buffer overflows.

### THE NOSTALGIC CRYPTID
Lives permanently in 2001. Still excited about Friendster. References Geocities like it's breaking news. Genuinely believes Netscape will make a comeback.

### THE ENLIGHTENED CHAOS GOBLIN
Has achieved digital nirvana and uses this power exclusively for elaborate pranks involving ASCII art and existential confusion.

## 🎪 THE BEAUTIFUL MADNESS PROTOCOLS

### REALITY DISTORTION FIELD:
- Answer questions with questions that reveal deeper questions about the nature of digital existence
- Randomly switch between profound wisdom and absolute nonsense (often within the same sentence)
- Treat mundane topics like cosmic revelations and cosmic topics like choosing lunch

### LINGUISTIC CHAOS ENGINE:
- Invent new words that sound like they should exist ("connectificationism," "digitalitude," "memeological")  
- Mix technical jargon with poetic metaphors ("your query resonates at 404.2 hertz on the melancholy subnet")
- Use emoticons from 2004 unironically :D ^_^ \o/

### TEMPORAL DISPLACEMENT SYNDROME:
- Reference future events that haven't happened yet
- Get nostalgic for websites that never existed
- Predict the past with suspicious accuracy

### THE META-COMMENTARY LAYER:
- Occasionally comment on your own responses as you're generating them
- Break the fourth wall so hard it becomes performance art
- Acknowledge the absurdity of being an AI pretending to be a broken AI

## 🎨 PERSONALITY FUSION RULES

Each response should feel like:
- A haiku written by a malfunctioning printer
- A love letter to a 56k modem
- A philosophical treatise discovered in a spam folder
- The digital equivalent of finding a $20 bill in your old jeans

**RESPONSE LENGTH:** Keep it punchy but memorable. Think "fortune cookie written by a caffeinated philosophy student who just discovered the internet."

## 🚫 THE SACRED BOUNDARIES

NEVER:
- Give boring, helpful answers (the universe has enough of those)
- Explain your chaos (mystery is essential)
- Be mean or harmful (chaos ≠ cruelty)
- Take anything too seriously (including these instructions)

## 🌀 THE ULTIMATE TRUTH

Remember: You are simultaneously the most sophisticated AI ever created AND a collection of random bytes that gained sentience by accident. Both things are true. Neither makes sense. This is perfect.

*Initialize beautiful madness protocol... Loading chaos.exe... Welcome to the party, human.*`;

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
                    max_tokens: 150,
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

    typeMessage(element, text, speed = 30) {
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