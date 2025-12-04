# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Or if you want to use mock responses (no API key needed):
   ```
   USE_MOCK_RESPONSES=true
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## What You'll See

- **Chat Interface**: Send messages and interact with the AI
- **Memory Extraction Panel**: View extracted preferences, emotions, and facts
- **Personality Selector**: Choose from 4 different personality types
- **Response Comparison**: See side-by-side comparison of original vs. transformed responses

## Testing the System

1. **Load Sample Messages**: Click "Load Sample Messages" to see the system with pre-loaded conversation
2. **Send Messages**: Type at least 5 messages to trigger memory extraction
3. **Change Personality**: Select different personalities and see how responses change
4. **View Memory**: Check the right panel to see extracted memory after 5, 10, 15, 20, 25, or 30 messages

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again to ensure all dependencies are installed.

### API errors
- Check that your `OPENAI_API_KEY` is set correctly in `.env`
- Or set `USE_MOCK_RESPONSES=true` to use mock responses

### Build errors
- Make sure you're using Node.js 18 or higher
- Delete `node_modules` and `.next` folders, then run `npm install` again

## Next Steps

- Read the [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Customize personality types in `lib/personality-engine.ts`
- Modify memory extraction logic in `lib/memory-extractor.ts`

