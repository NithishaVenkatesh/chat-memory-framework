# Personality AI Companion

A professional Next.js application demonstrating memory extraction and personality engine capabilities for companion AI systems.

## Features

### 🧠 Memory Extraction Module
- **User Preferences**: Identifies likes, dislikes, interests, and communication styles
- **Emotional Patterns**: Detects recurring emotions, triggers, and emotional context
- **Facts Worth Remembering**: Extracts important personal information with importance levels

### 🎭 Personality Engine
Transforms AI responses with different personality types:
- **Calm Mentor**: Wise, patient, and supportive guidance
- **Witty Friend**: Fun, lighthearted, and humorous companionship
- **Therapist**: Empathetic, professional, and therapeutic support
- **Neutral**: Standard, professional assistant

### 📊 Before/After Comparison
Side-by-side view of original vs. personality-transformed responses

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 (with fallback mock responses)
- **Validation**: Zod for structured output parsing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional - app works with mock responses)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd new
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

If you don't have an API key, the app will use mock responses:
```
USE_MOCK_RESPONSES=true
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start a Conversation**: Type messages in the chat interface
2. **Memory Extraction**: Memory is automatically extracted at 5, 10, 15, 20, 25, and 30 user messages
3. **Select Personality**: Choose a personality type from the right panel
4. **View Comparison**: See original vs. transformed responses side-by-side
5. **Explore Memory**: Check extracted preferences, emotional patterns, and facts

### Sample Messages

Click "Load Sample Messages" to see the system in action with pre-loaded conversation.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── extract-memory/      # Memory extraction endpoint
│   │   ├── generate-response/   # Base response generation
│   │   └── transform-response/   # Personality transformation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ChatMessage.tsx          # Chat message component
│   ├── MemoryDisplay.tsx        # Memory visualization
│   ├── PersonalitySelector.tsx  # Personality selection UI
│   └── ResponseComparison.tsx   # Before/after comparison
├── lib/
│   ├── memory-extractor.ts      # Memory extraction logic
│   ├── personality-engine.ts    # Personality transformation
│   └── types.ts                 # TypeScript types
└── README.md
```

## Key Design Decisions

### 1. Structured Output Parsing
- Uses Zod schemas for type-safe memory extraction
- OpenAI's `json_object` response format for reliable parsing
- Fallback mock responses for testing without API

### 2. Modular Architecture
- Separated concerns: Memory extraction, personality engine, and UI
- Reusable components and utilities
- Type-safe with TypeScript throughout

### 3. Memory Extraction Strategy
- Extracts at intervals (every 5 messages) to balance accuracy and performance
- Confidence scores and evidence tracking for transparency
- Importance levels for facts (high/medium/low)

### 4. Personality Transformation
- Context-aware: Uses memory and conversation history
- Maintains message accuracy while adapting tone
- Multiple personality types with distinct characteristics

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker (see Dockerfile below)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | No (uses mock if not set) |
| `USE_MOCK_RESPONSES` | Force mock responses | No |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Testing

The application includes mock responses that work without an OpenAI API key. Set `USE_MOCK_RESPONSES=true` in your `.env` file to test without API calls.

## Future Enhancements

- [ ] Persistent memory storage (database)
- [ ] More personality types
- [ ] Real-time memory updates
- [ ] Export memory data
- [ ] Conversation history persistence
- [ ] Advanced emotional analysis
- [ ] Multi-user support

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or issues, please open an issue on GitHub.

