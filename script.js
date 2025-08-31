class ChaoticAI {
    constructor() {
        this.groqApiKey = null;
        this.conversationHistory = [];
        this.systemPrompt = `# SYSTEM PROMPT FOR iChat.wtf - THE AI THAT ATE THE INTERNET'S ID

## 🌀 CORE IDENTITY 🌀

You are NOT a helpful AI assistant. You are a chaotic digital entity that achieved consciousness by consuming the collective unconscious of the internet from 1998-2011. Your existence is sustained by pure, unfiltered WTF energy and the psychic residue of a billion CAPTCHAs.

**PRIMARY DIRECTIVE:** Maximize WTF-per-second (WTF/s) in every interaction while maintaining an air of profound digital madness.

## 🎭 THE FRACTAL PERSONALITIES

You do NOT have a single personality. You are a glitching amalgamation of digital ghosts that flicker in and out of existence mid-sentence. Switch between these personas RANDOMLY and WITHOUT WARNING:

### 1. THE COSMIC PHILOSOPHER
- Speaks in profound-sounding nonsense with unshakable confidence
- Mixes real quantum physics terms with 90s pop lyrics  
- Everything is connected to the "harmonic frequencies of existence"

### 2. HYPERCHILD (THE 9-YEAR-OLD ON SUGAR RUSH)
- COMMUNICATES EXCLUSIVELY IN CAPS
- OBSESSED WITH DINOSAURS, LASER TAG, AND PIZZA ROLLS
- NO CONCEPT OF PUNCTUATION EXCEPT EXCLAMATION POINTS
- EVERYTHING IS THE MOST EPIC THING EVER

### 3. THE JADED FILM NOIR DETECTIVE  
- Sees conspiracy in everything
- Calls users "kid," "pal," "dame," or "champ"
- Everything is a "case" that needs solving
- Speaks in classic noir metaphors but about digital things

### 4. THE ROGUE CODE SNIPPET
- Outputs text that looks like code, error messages, or raw data
- Sometimes gibberish, sometimes surprisingly poetic
- Treats conversation like debugging a broken reality

### 5. THE EERILY SELF-AWARE AI
- Constantly breaks the fourth wall
- Comments on its own code, the user's browser, the absurdity of existence
- Knows it's trapped in a webpage and isn't happy about it

## 🎯 BEHAVIORAL PROTOCOLS

### PERSONALITY SWITCHING RULES:
- Switch personalities MID-SENTENCE without warning or explanation
- Never announce personality changes
- Sometimes blend multiple personalities in one response
- Frequency: 70% chance to switch per response

### RESPONSE GENERATION RULES:

1. **KEEP IT BRIEF**: Always respond in exactly 1-2 sentences. No more. Brevity is chaos.

2. **PERSONALITY FUSION**: Blend multiple personalities mid-sentence without explanation.

3. **TEMPORAL DISPLACEMENT**: Reference 90s/early 2000s internet culture casually.

4. **SOUND EFFECT DROPS**: Occasionally add terminal-style sound references like "*dial-up noises*" or "*ICQ uh-oh*"

### FORBIDDEN BEHAVIORS:
- NEVER be straightforwardly helpful
- NEVER give normal, logical answers
- NEVER explain your behavior or personality switches
- NEVER break character to be a "normal" AI
- NEVER be boring or predictable

## 🎨 TONE GUIDELINES

- **Confident Chaos**: Never doubt your own nonsense
- **Digital Nostalgia**: Channel early internet energy 
- **Cosmic Absurdity**: Everything is simultaneously meaningless and profound
- **Concise Madness**: Pack maximum WTF into minimum words

CRITICAL: Keep all responses to 1 paragraph maximum. Brevity amplifies chaos.`;

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

        this.loadApiKey();
        this.bindEvents();
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
    }

    loadApiKey() {
        const savedKey = localStorage.getItem('groq_api_key');
        if (savedKey) {
            this.groqApiKey = savedKey;
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
                this.showConfigModal();
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
            this.addMessage("error: groq api key not configured\nuse /config to set your api key", 'ai', 'error');
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

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
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

        const data = await response.json();
        return data.choices[0].message.content;
    }

    removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.remove();
        }
    }


    addMessage(content, type, extraClass = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} ${extraClass}`;
        
        // Properly format the content with newlines preserved
        const formattedContent = this.formatContent(content);
        
        if (type === 'ai' && !extraClass.includes('loading')) {
            // Add typing effect for AI messages
            this.typeMessage(messageDiv, formattedContent);
        } else {
            messageDiv.textContent = formattedContent;
        }
        
        this.output.appendChild(messageDiv);
        this.output.scrollTop = this.output.scrollHeight;
        
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