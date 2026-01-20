# Local Testing Guide

## Quick Start

You can test the booking functionality locally without Netlify! The chatbot automatically detects when you're running locally and uses mock data instead of real Acuity API calls.

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open the Chat

- Navigate to `http://localhost:8080` (or the port Vite shows)
- Click the chat bubble in the bottom-right corner

### 3. Test the Booking Flow

Try these commands in the chat:

1. **Start Booking:**
   ```
   I want to book a consultation this week
   ```

2. **Select a Slot:**
   - Available time slots will appear
   - Click on any slot

3. **Provide Information:**
   ```
   My name is John Smith and my email is john@example.com
   ```
   Or provide them separately:
   ```
   John Smith
   john@example.com
   ```

4. **Confirm:**
   - The booking will complete (using mock data)
   - You'll see a success message

## Mock Data

The local mock provides:
- **3 days** of sample availability
- **Multiple time slots** per day
- **Realistic delays** (simulates API calls)
- **Occasional conflicts** (10% chance) to test error handling

## What's Different in Local Mode?

- ✅ **No Acuity API calls** - Uses mock data
- ✅ **No environment variables needed** - Works out of the box
- ✅ **Faster testing** - No network delays (except simulated ones)
- ✅ **Safe testing** - Won't create real appointments

## Console Messages

When running locally, you'll see:
```
🔧 Using mock API for local development
```

This confirms the mock API is being used.

## Testing Different Scenarios

### Test No Availability
The mock always returns slots, but you can modify `src/api/mock-acuity.ts` to return empty arrays for testing.

### Test Booking Conflicts
The mock has a 10% chance of simulating a slot conflict. Keep trying to see the error handling.

### Test Natural Language
Try various phrasings:
- "I want to book a consultation"
- "Can I schedule an appointment?"
- "Book me for next week"
- "I need to book this week"

## Switching to Real API

When you're ready to test with the real Acuity API:

1. **Option 1: Use Netlify Dev** (recommended)
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```
   This runs Netlify functions locally with your environment variables.

2. **Option 2: Deploy to Netlify**
   - Push to your main branch
   - Netlify will auto-deploy
   - Add environment variables in Netlify dashboard
   - Test on the live site

## Troubleshooting

### Chat doesn't open
- Check browser console for errors
- Make sure Vite dev server is running

### Slots don't appear
- Check browser console for errors
- Verify the mock API is being used (look for 🔧 emoji in console)

### Booking fails
- Check browser console for detailed error messages
- The mock simulates some errors to test error handling

## Next Steps

Once local testing works:
1. Test all booking scenarios
2. Verify error handling
3. Test natural language parsing
4. Deploy to Netlify for real API testing
