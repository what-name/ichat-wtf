# API Key Configuration Guide - Cloudflare Pages Edition

This document explains how to configure iChat.wtf for different deployment scenarios on Cloudflare Pages.

## 🌐 Cloudflare Pages Deployment (Recommended)

The system automatically detects if a `GROQ_API_KEY` environment variable exists in your Cloudflare Pages deployment and switches modes accordingly.

### Setup Steps:

1. **Deploy to Cloudflare Pages**: Connect your GitHub repo to Cloudflare Pages
2. **Set Environment Variable** (optional): In Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
   - Variable name: `GROQ_API_KEY`
   - Value: Your Groq API key (e.g., `gsk_xxxxxxxxxxxxx`)

## 🎛️ Deployment Modes

### Mode 1: System-Provided API Key (Art Installation Mode)
**Triggered when**: `GROQ_API_KEY` environment variable exists in Cloudflare

**Features**:
- ✅ Automatic detection - no code changes needed
- ✅ Users get immediate access without configuration  
- ✅ API key stays secure on server (never sent to browser)
- ✅ `/config` command shows "system-managed chaos engine detected"
- ✅ Config button automatically hidden from UI
- ✅ Perfect for public art installations

### Mode 2: User-Provided API Keys (BYOK Mode)
**Triggered when**: No `GROQ_API_KEY` environment variable

**Features**:
- ✅ Users must provide their own Groq API keys
- ✅ Shows "error: groq api key not configured" message
- ✅ `/config` command opens API key input modal
- ✅ Config button visible in top-right corner
- ✅ Zero costs to you - users pay for their own usage

## 🏗️ Technical Architecture

### Cloudflare Pages Functions
The system uses two serverless functions:
- `/api/check-system-key` - Checks if environment variable exists
- `/api/chat` - Proxies Groq API calls using system key

### Security Benefits
- API key never exposed to browser/client
- Environment variables stay secure on Cloudflare edge
- CORS properly configured for browser access

## 🚀 Deployment Workflow

### For Public Art Release:
1. Set `GROQ_API_KEY` environment variable in Cloudflare
2. Deploy - users get immediate access
3. Monitor usage in Groq dashboard

### For Community/Developer Sharing:
1. Don't set `GROQ_API_KEY` environment variable
2. Deploy - users must bring own keys
3. Zero API costs to you

### To Switch Modes:
- **Enable Free Access**: Add `GROQ_API_KEY` environment variable
- **Enable Gated Access**: Remove `GROQ_API_KEY` environment variable
- Changes take effect immediately on next deployment

## 📁 File Structure
```
/
├── functions/
│   └── api/
│       ├── check-system-key.js  # Detects system key
│       └── chat.js              # Proxies API calls
├── script.js                    # Auto-detects mode
├── index.html
└── style.css
```

## 🔧 Environment Variable Setup

1. **Cloudflare Dashboard**: Login → Pages → Your Project
2. **Settings**: Go to Settings tab → Environment Variables
3. **Add Variable**: 
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_actual_groq_api_key_here`
4. **Deploy**: Changes take effect on next deployment

## ⚠️ Security Best Practices

- ✅ API keys stored as Cloudflare environment variables (encrypted)
- ✅ Keys never exposed to browser/client-side code
- ✅ CORS configured to prevent unauthorized access
- ✅ Functions validate requests before proxying to Groq
- ❌ Never commit API keys to Git repository

## 💡 Pro Tips

- **Local Development**: Functions won't work locally - use user-provided keys for testing
- **Instant Switching**: Add/remove environment variable to toggle modes instantly
- **Cost Control**: Monitor Groq dashboard when using system keys
- **Fallback**: System gracefully falls back to user-key mode if functions fail

## 🌟 Benefits of This Approach

1. **Zero Configuration**: Auto-detects deployment environment
2. **Secure by Default**: API keys never leave server
3. **Flexible**: Switch between free/gated access instantly  
4. **Scalable**: Cloudflare edge handles all the traffic
5. **Cost Efficient**: Pay only for actual API usage