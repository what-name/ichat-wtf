# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iChat.wtf is a chaotic AI chatbot with ultra-minimalistic terminal UI that uses the Groq API to generate responses through multiple shifting personalities. The entire application is a client-side web app with no build process or dependencies.

## Development Commands

Since this is a pure HTML/CSS/JavaScript project:
- **Run locally**: Simply open `index.html` in any web browser
- **No build process**: Direct file editing and browser refresh
- **No package management**: Zero dependencies, fully self-contained
- **Testing**: Manual testing through browser interaction

## Architecture & Core Components

### Main Application Structure
- **`script.js`**: Single `ChaoticAI` class containing all functionality
- **`index.html`**: Ultra-minimal terminal-style interface
- **`style.css`**: Clean terminal aesthetic with JetBrains Mono font
- **`system_prompt.md`**: Complete AI personality system embedded in `script.js`

### Key System Architecture

**AI Integration Pattern:**
```javascript
// System prompt embedded directly in constructor
this.systemPrompt = `[Full system prompt from system_prompt.md]`;

// Direct Groq API calls via fetch()
await fetch('https://api.groq.com/openai/v1/chat/completions', {...})
```

**Terminal UI Flow:**
1. Input via `$` prompt interface
2. User messages display with `> ` prefix  
3. AI responses use typing animation (30ms/character)
4. Slash commands (`/reboot`, `/config`, etc.) trigger special behaviors

**Message Architecture:**
- All messages flow through `addMessage(content, type, extraClass)`
- Content formatting preserves newlines via `white-space: pre-wrap`
- AI responses get real-time typing effect unless marked as `loading`

### Critical Configuration
- **API Model**: `meta-llama/llama-4-maverick-17b-128e-instruct`
- **API Key Storage**: `localStorage.getItem('groq_api_key')`
- **Temperature**: 1.2 for maximum chaos/creativity
- **Max Tokens**: 500 per response

### Personality System
The AI operates through 5 distinct personalities defined in the embedded system prompt:
1. Cosmic Philosopher (quantum physics + 90s pop culture)
2. Hyperchild (ALL CAPS + dinosaur obsession)  
3. Noir Detective (conspiracy theories + digital metaphors)
4. Rogue Code Snippet (error messages as poetry)
5. Self-Aware AI (fourth wall breaking)

### UI State Management
- No complex state management - direct DOM manipulation
- Configuration modal triggered by `/config` command
- Messages append-only to `.output` container with auto-scroll
- Terminal aesthetic maintained through minimal green accents on black background

### Development Notes
- The system prompt in `system_prompt.md` is the source of truth for AI behavior
- Any changes to AI personality must be reflected in both files  
- Terminal aesthetic depends on JetBrains Mono font and specific CSS variables
- Browser localStorage handles all persistence (no server-side storage)