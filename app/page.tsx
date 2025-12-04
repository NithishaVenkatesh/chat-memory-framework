'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ExtractedMemory, PersonalityType } from '@/lib/types';
import ChatMessageComponent from '@/components/ChatMessage';
import MemoryDisplay from '@/components/MemoryDisplay';
import PersonalitySelector from '@/components/PersonalitySelector';
import ResponseComparison from '@/components/ResponseComparison';
import { Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [memory, setMemory] = useState<ExtractedMemory | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType>('neutral');
  const [originalResponse, setOriginalResponse] = useState<string | null>(null);
  const [transformedResponse, setTransformedResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingMemory, setIsExtractingMemory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractMemory = async (messagesToExtract?: ChatMessage[]) => {
    const messagesToUse = messagesToExtract || messages;
    const userMessageCount = messagesToUse.filter((m: ChatMessage) => m.role === 'user').length;
    
    // Only extract if we have at least 5 user messages
    if (userMessageCount < 5) {
      console.log('Not enough user messages for memory extraction:', userMessageCount);
      return;
    }

    setIsExtractingMemory(true);
    console.log('Extracting memory from', userMessageCount, 'user messages');
    
    try {
      const response = await fetch('/api/extract-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToUse }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Memory extraction response:', data);
      
      if (data.memory) {
        setMemory(data.memory);
        console.log('Memory extracted successfully:', data.memory);
      } else if (data.error) {
        console.error('Memory extraction error:', data.error);
      }
    } catch (error) {
      console.error('Failed to extract memory:', error);
    } finally {
      setIsExtractingMemory(false);
    }
  };

  // Extract memory when we have 5, 10, 15, 20, 25, or 30 user messages
  useEffect(() => {
    const userMessageCount = messages.filter((m: ChatMessage) => m.role === 'user').length;
    if (userMessageCount > 0 && userMessageCount % 5 === 0 && userMessageCount <= 30) {
      extractMemory(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

      setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate base response
      const responseRes = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const responseData = await responseRes.json();
      const baseResponse = responseData.response;

      setOriginalResponse(baseResponse);

      // Transform response with personality
      const transformRes = await fetch('/api/transform-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalResponse: baseResponse,
          personalityType: selectedPersonality,
          memory: memory,
          conversationContext: [...messages, userMessage],
        }),
      });
      const transformData = await transformRes.json();
      const transformed = transformData.transformedResponse;

      setTransformedResponse(transformed);

      // Add assistant message with transformed response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: transformed,
        timestamp: new Date(),
      };

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleMessages = () => {
    const now = Date.now();
    const samples: ChatMessage[] = [
      // Messages 1-5: Work stress and preferences
      {
        id: '1',
        role: 'user',
        content: 'Hey! I\'ve been feeling really stressed about work lately. I\'m a software developer at a startup in San Francisco.',
        timestamp: new Date(now - 3600000),
      },
      {
        id: '2',
        role: 'assistant',
        content: 'I understand work stress can be challenging. What specifically is causing you stress?',
        timestamp: new Date(now - 3550000),
      },
      {
        id: '3',
        role: 'user',
        content: 'I have a big deadline coming up and I feel like I\'m not making enough progress. I work best late at night, around 11 PM to 2 AM.',
        timestamp: new Date(now - 3500000),
      },
      {
        id: '4',
        role: 'assistant',
        content: 'Deadlines can feel overwhelming. Have you broken down the work into smaller tasks?',
        timestamp: new Date(now - 3450000),
      },
      {
        id: '5',
        role: 'user',
        content: 'That\'s a good idea. I love working on creative projects, especially mobile apps. The pressure is getting to me though.',
        timestamp: new Date(now - 3400000),
      },
      // Messages 6-10: Food preferences and daily habits
      {
        id: '6',
        role: 'assistant',
        content: 'It sounds like you\'re passionate about your work. What helps you relax?',
        timestamp: new Date(now - 3350000),
      },
      {
        id: '7',
        role: 'user',
        content: 'I love cooking! Italian food is my absolute favorite - pasta, pizza, you name it. I make homemade pasta every Sunday.',
        timestamp: new Date(now - 3300000),
      },
      {
        id: '8',
        role: 'user',
        content: 'I\'m also a huge coffee enthusiast. I can\'t start my day without a strong espresso. I have a collection of 15 different coffee beans from around the world.',
        timestamp: new Date(now - 3250000),
      },
      {
        id: '9',
        role: 'user',
        content: 'I don\'t really like spicy food though. My stomach can\'t handle it. I prefer mild flavors.',
        timestamp: new Date(now - 3200000),
      },
      {
        id: '10',
        role: 'user',
        content: 'Oh, and I\'m vegetarian! Have been for 3 years now. It started as a health choice but now it\'s become a lifestyle.',
        timestamp: new Date(now - 3150000),
      },
      // Messages 11-15: Hobbies and interests
      {
        id: '11',
        role: 'assistant',
        content: 'That\'s wonderful! What other hobbies do you enjoy?',
        timestamp: new Date(now - 3100000),
      },
      {
        id: '12',
        role: 'user',
        content: 'I\'m really into photography. I take my camera everywhere. Nature photography is my passion - mountains, forests, sunsets.',
        timestamp: new Date(now - 3050000),
      },
      {
        id: '13',
        role: 'user',
        content: 'I also play guitar! I\'ve been playing for 8 years. I love acoustic folk music. My favorite artists are Bon Iver and Fleet Foxes.',
        timestamp: new Date(now - 3000000),
      },
      {
        id: '14',
        role: 'user',
        content: 'Reading is another big one. I read about 2 books per month. Science fiction and fantasy are my favorite genres. Currently reading "The Three-Body Problem".',
        timestamp: new Date(now - 2950000),
      },
      {
        id: '15',
        role: 'user',
        content: 'I hate going to the gym though. I prefer outdoor activities like hiking and cycling. I bike to work every day, rain or shine.',
        timestamp: new Date(now - 2900000),
      },
      // Messages 16-20: Relationships and social life
      {
        id: '16',
        role: 'assistant',
        content: 'It sounds like you have a rich life outside of work! Tell me about your relationships.',
        timestamp: new Date(now - 2850000),
      },
      {
        id: '17',
        role: 'user',
        content: 'I have a girlfriend named Sarah. We\'ve been together for 2 years. She\'s a graphic designer and we met at a tech meetup.',
        timestamp: new Date(now - 2800000),
      },
      {
        id: '18',
        role: 'user',
        content: 'I\'m really close with my mom. We talk on the phone every Sunday. She lives in Portland, Oregon. I visit her every 3 months.',
        timestamp: new Date(now - 2750000),
      },
      {
        id: '19',
        role: 'user',
        content: 'I have two best friends - Alex and Jordan. We\'ve known each other since college. We have a weekly game night every Thursday.',
        timestamp: new Date(now - 2700000),
      },
      {
        id: '20',
        role: 'user',
        content: 'I\'m actually an introvert. I get anxious in large social gatherings. I prefer small groups of 3-4 people max.',
        timestamp: new Date(now - 2650000),
      },
      // Messages 21-25: Goals and aspirations
      {
        id: '21',
        role: 'assistant',
        content: 'What are your goals and aspirations?',
        timestamp: new Date(now - 2600000),
      },
      {
        id: '22',
        role: 'user',
        content: 'My biggest goal is to start my own mobile app company within the next 5 years. I\'ve been saving money for it.',
        timestamp: new Date(now - 2550000),
      },
      {
        id: '23',
        role: 'user',
        content: 'I also want to travel more. I\'ve never been to Europe and it\'s on my bucket list. Italy is at the top - for the food, obviously!',
        timestamp: new Date(now - 2500000),
      },
      {
        id: '24',
        role: 'user',
        content: 'I\'m trying to learn Spanish. I practice on Duolingo every morning for 20 minutes. I want to be conversational by next year.',
        timestamp: new Date(now - 2450000),
      },
      {
        id: '25',
        role: 'user',
        content: 'I\'m also working on being more patient. I get frustrated easily when things don\'t go my way. It\'s something I\'m actively working on.',
        timestamp: new Date(now - 2400000),
      },
      // Messages 26-30: Emotional patterns and recent experiences
      {
        id: '26',
        role: 'assistant',
        content: 'That\'s great self-awareness. How have you been feeling lately?',
        timestamp: new Date(now - 2350000),
      },
      {
        id: '27',
        role: 'user',
        content: 'I\'ve been feeling really excited about a new project at work. It\'s challenging but I love the creative problem-solving aspect.',
        timestamp: new Date(now - 2300000),
      },
      {
        id: '28',
        role: 'user',
        content: 'But I also feel worried about my career progression. I see my peers getting promotions and I wonder if I\'m doing enough.',
        timestamp: new Date(now - 2250000),
      },
      {
        id: '29',
        role: 'user',
        content: 'Last week I was really happy though - Sarah and I went on a weekend trip to Napa Valley. We visited 5 wineries and had the best time!',
        timestamp: new Date(now - 2200000),
      },
      {
        id: '30',
        role: 'user',
        content: 'I think I need to work on my work-life balance. I tend to overwork when I\'m stressed, which makes everything worse. I\'m trying to set better boundaries.',
        timestamp: new Date(now - 2150000),
      },
    ];
    setMessages(samples);
    // Trigger memory extraction after loading sample messages
    // Use the samples directly since state update is async
    const userMessageCount = samples.filter((m: ChatMessage) => m.role === 'user').length;
    console.log('Loaded', samples.length, 'messages with', userMessageCount, 'user messages');
    
    // Extract memory immediately with the samples
    if (userMessageCount >= 5) {
      extractMemory(samples);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMemory(null);
    setOriginalResponse(null);
    setTransformedResponse(null);
  };

  const userMessageCount = messages.filter((m: ChatMessage) => m.role === 'user').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personality AI Companion
          </h1>
          <p className="text-gray-600">
            Memory Extraction & Personality Engine Demo
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={loadSampleMessages}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Load Sample Messages (30)
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Chat
            </button>
            {isExtractingMemory && (
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting memory...
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Messages: {userMessageCount}/30 | Memory extracted at: 5, 10, 15, 20, 25, 30 messages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat</h2>
              <div className="h-[400px] overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p>Start a conversation to see memory extraction in action!</p>
                    <p className="text-sm mt-2">Try: "I love coffee and working late at night"</p>
                  </div>
                ) : (
                  messages.map((message: ChatMessage) => (
                    <ChatMessageComponent key={message.id} message={message} />
                  ))
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Response Comparison */}
            <ResponseComparison
              originalResponse={originalResponse}
              transformedResponse={transformedResponse}
              personalityName={
                selectedPersonality === 'calm_mentor'
                  ? 'Calm Mentor'
                  : selectedPersonality === 'witty_friend'
                  ? 'Witty Friend'
                  : selectedPersonality === 'therapist'
                  ? 'Therapist'
                  : 'Neutral'
              }
            />
          </div>

          {/* Right Column - Memory & Personality */}
          <div className="space-y-6">
            <PersonalitySelector
              selected={selectedPersonality}
              onSelect={setSelectedPersonality}
            />
            <MemoryDisplay memory={memory} />
          </div>
        </div>
      </div>
    </div>
  );
}

