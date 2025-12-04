# Architecture Overview

## System Design

This application demonstrates a modular architecture for companion AI systems with memory extraction and personality transformation capabilities.

## Core Components

### 1. Memory Extraction Module (`lib/memory-extractor.ts`)

**Purpose**: Analyzes conversation history to extract structured memory about the user.

**Key Features**:
- **Structured Output Parsing**: Uses Zod schemas for type-safe extraction
- **Three Memory Types**:
  - User Preferences: Likes, dislikes, interests, communication style
  - Emotional Patterns: Recurring emotions, triggers, context
  - Facts: Important personal information with importance levels
- **Evidence Tracking**: Each extracted memory includes evidence from conversation
- **Confidence Scores**: Preferences and patterns include confidence metrics

**Implementation**:
- Uses OpenAI GPT-4 with `json_object` response format for reliable parsing
- Fallback to mock responses when API key is unavailable
- Extracts at intervals (every 5 messages) for optimal performance

### 2. Personality Engine (`lib/personality-engine.ts`)

**Purpose**: Transforms AI responses to match different personality types.

**Personality Types**:
1. **Calm Mentor**: Thoughtful, encouraging, measured guidance
2. **Witty Friend**: Playful, energetic, humorous companionship
3. **Therapist**: Empathetic, non-judgmental, therapeutic support
4. **Neutral**: Standard, professional assistant

**Key Features**:
- Context-aware transformation using memory and conversation history
- Maintains message accuracy while adapting tone
- Configurable personality definitions with examples

**Implementation**:
- Uses OpenAI GPT-4 for natural personality transformation
- Personality configs stored as TypeScript constants
- Mock transformations available for testing

### 3. API Routes

**`/api/extract-memory`**:
- Input: Array of chat messages
- Output: Extracted memory (preferences, emotions, facts)
- Triggers: Called automatically at message milestones

**`/api/generate-response`**:
- Input: Conversation history
- Output: Base AI response (neutral tone)
- Purpose: Generate initial response before personality transformation

**`/api/transform-response`**:
- Input: Original response, personality type, memory, context
- Output: Personality-transformed response
- Purpose: Apply personality to base response

### 4. UI Components

**Main Page (`app/page.tsx`)**:
- Chat interface with message history
- Automatic memory extraction triggers
- Personality selection
- Response comparison display

**Components**:
- `ChatMessage`: Individual message display
- `MemoryDisplay`: Visualizes extracted memory
- `PersonalitySelector`: Personality type selection
- `ResponseComparison`: Side-by-side before/after view

## Data Flow

```
User Message
    ↓
Chat Interface
    ↓
Generate Base Response (Neutral)
    ↓
Extract Memory (at intervals)
    ↓
Transform Response (with selected personality)
    ↓
Display: Original vs. Transformed
    ↓
Update Memory Display
```

## Key Design Decisions

### 1. Structured Output Parsing
- **Why**: Ensures reliable, type-safe memory extraction
- **How**: Zod schemas validate OpenAI responses
- **Benefit**: Prevents runtime errors and ensures data consistency

### 2. Modular Architecture
- **Why**: Separation of concerns, testability, maintainability
- **How**: Separate modules for memory, personality, and UI
- **Benefit**: Easy to extend and modify individual components

### 3. Interval-Based Memory Extraction
- **Why**: Balance between accuracy and performance
- **How**: Extract at 5, 10, 15, 20, 25, 30 message milestones
- **Benefit**: Reduces API calls while maintaining relevance

### 4. Two-Stage Response Generation
- **Why**: Separates content generation from personality application
- **How**: Generate neutral response first, then transform
- **Benefit**: Clear before/after comparison, easier debugging

### 5. Mock Response Fallback
- **Why**: Allows testing without API key
- **How**: Environment variable flag
- **Benefit**: Development and demonstration without costs

## Type Safety

All data structures are defined in `lib/types.ts`:
- `ChatMessage`: Message structure
- `ExtractedMemory`: Memory extraction output
- `UserPreference`, `EmotionalPattern`, `Fact`: Memory components
- `PersonalityType`, `PersonalityConfig`: Personality definitions

## Extensibility

### Adding New Personality Types

1. Add type to `PersonalityType` in `lib/types.ts`
2. Add config to `PERSONALITY_CONFIGS` in `lib/personality-engine.ts`
3. UI automatically updates (no component changes needed)

### Enhancing Memory Extraction

1. Modify extraction prompt in `MemoryExtractor.callOpenAI()`
2. Update Zod schema in `MemoryExtractor` if needed
3. Adjust extraction intervals in `app/page.tsx`

### Customizing UI

- All components are in `components/` directory
- Styling uses Tailwind CSS (configurable in `tailwind.config.ts`)
- Main layout in `app/page.tsx`

## Performance Considerations

- Memory extraction only at intervals (not every message)
- API calls are async and non-blocking
- UI updates are optimized with React state management
- Mock responses for development/testing

## Security

- API keys stored in environment variables (never in code)
- `.env` files excluded from git
- Input validation on API routes
- Type-safe data handling throughout

## Testing Strategy

1. **Mock Mode**: Test without API key using `USE_MOCK_RESPONSES=true`
2. **Sample Messages**: Pre-loaded conversation for demonstration
3. **Manual Testing**: Full flow through UI
4. **Type Checking**: TypeScript ensures type safety

## Future Enhancements

- Persistent memory storage (database)
- Real-time memory updates
- More sophisticated emotional analysis
- Multi-user support
- Conversation history persistence
- Export/import memory data

