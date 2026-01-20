# AI FAQ Chatbot Setup Guide

## Overview
The AI FAQ Chatbot uses Claude API (Anthropic) to answer customer questions about Hiyam Bridal. The chatbot is already integrated into the site and will appear as a floating button in the bottom-right corner.

## Setup Instructions

### 1. Get Your Anthropic API Key

1. Sign up for an account at [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (it starts with `sk-ant-...`)

### 2. Add API Key to Netlify

**Option A: Via Netlify Dashboard (Recommended)**
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your API key (paste the key you copied)
5. Click **Save**

**Option B: Via Netlify CLI**
```bash
netlify env:set ANTHROPIC_API_KEY "sk-ant-your-key-here"
```

### 3. Deploy

After adding the environment variable, redeploy your site:
- If using automatic deploys: Push to your connected Git branch
- If using manual deploys: Redeploy from Netlify dashboard

### 4. Test the Chatbot

1. Visit your deployed site
2. Look for the chat bubble icon in the bottom-right corner
3. Click it to open the chat
4. Try asking: "What are your business hours?" or "How long does delivery take?"

## Cost Estimate

Using Claude Haiku (the model configured):
- **Cost**: ~$0.25 per million input tokens, ~$1.25 per million output tokens
- **Average FAQ response**: ~200 tokens
- **Estimated cost per conversation**: ~$0.0003
- **1,000 conversations**: ~$0.30

Anthropic offers free trial credits to get started.

## Customization

### Update FAQ Content

Edit the `FAQ_CONTENT` constant in:
- `netlify/functions/chat.ts` (for the API)
- `src/components/chat/AIFaqChatbot.tsx` (for reference)

### Change Chatbot Position

In `src/components/layout/Layout.tsx`, change the `position` prop:
```tsx
<AIFaqChatbot companyName="Hiyam Bridal" position="bottom-left" />
```

### Customize Colors

The chatbot automatically uses your site's color scheme (beige/rosy pink) via CSS variables.

## Troubleshooting

### Chatbot doesn't respond
- Check that `ANTHROPIC_API_KEY` is set in Netlify environment variables
- Verify the API key is valid in Anthropic Console
- Check Netlify function logs: **Site settings** → **Functions** → **View logs**

### "Server configuration error" message
- The API key is missing or not accessible
- Ensure the environment variable is set and the site is redeployed

### CORS errors
- The function already handles CORS. If issues persist, check Netlify function logs.

## Support

For issues with:
- **Anthropic API**: Check [Anthropic Documentation](https://docs.anthropic.com/)
- **Netlify Functions**: Check [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- **Chatbot Component**: Review the code in `src/components/chat/`
