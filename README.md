# Personality AI Companion

A Next.js application that demonstrates memory extraction and personality transformation for AI companion systems.

## Overview

This application processes user chat messages to extract memory (preferences, emotional patterns, and facts) and transforms AI responses using different personality types.

## Features

- Memory Extraction: Analyzes conversations to identify user preferences, emotional patterns, and important facts
- Personality Engine: Transforms AI responses with different personality types (Calm Mentor, Witty Friend, Therapist, Neutral)
- Response Comparison: Side-by-side view of original vs personality-transformed responses

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API
- Zod (structured output parsing)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google Gemini API key (optional - app works with mock responses)

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

Create a `.env` file in the root directory:
```
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

If you don't have an API key, the app will use mock responses:
```
USE_MOCK_RESPONSES=true
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Usage

1. Start a conversation by typing messages in the chat interface
2. Memory is automatically extracted at 5, 10, 15, 20, 25, and 30 user messages
3. Select a personality type from the right panel to transform responses
4. View the comparison between original and transformed responses
5. Explore extracted memory in the right panel

Click "Load Sample Messages (30)" to see the system in action with pre-loaded conversation data.

## Project Structure

```
app/
  api/              # API routes for memory extraction and response transformation
  page.tsx          # Main application page
components/         # React components
lib/                # Core logic (memory extraction, personality engine)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GOOGLE_GEMINI_API_KEY | Your Google Gemini API key | No (uses mock if not set) |
| USE_MOCK_RESPONSES | Force mock responses | No |

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

1. Push your code to GitHub
2. Import the project in your hosting platform
3. Add the `GOOGLE_GEMINI_API_KEY` environment variable
4. Deploy

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

