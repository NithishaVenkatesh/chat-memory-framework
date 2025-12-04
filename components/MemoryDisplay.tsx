'use client';

import { ExtractedMemory } from '@/lib/types';
import { Brain, Heart, Info } from 'lucide-react';

interface MemoryDisplayProps {
  memory: ExtractedMemory | null;
}

export default function MemoryDisplay({ memory }: MemoryDisplayProps) {
  if (!memory) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No memory extracted yet. Send at least 5 messages to extract memory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">User Preferences</h3>
        </div>
        <div className="space-y-3">
          {memory.preferences.map((pref, idx) => (
            <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{pref.category}</span>
                <span className="text-xs text-gray-500">
                  {(pref.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className="text-sm text-gray-700">{pref.value}</p>
              {pref.evidence.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Evidence ({pref.evidence.length})
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    {pref.evidence.map((ev, i) => (
                      <li key={i} className="pl-2 border-l-2 border-gray-200">
                        &quot;{ev.substring(0, 100)}{ev.length > 100 ? '...' : ''}&quot;
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Patterns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Emotional Patterns</h3>
        </div>
        <div className="space-y-3">
          {memory.emotionalPatterns.map((pattern, idx) => (
            <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{pattern.emotion}</span>
                <span className="text-xs text-gray-500">
                  {(pattern.frequency * 100).toFixed(0)}% frequency
                </span>
              </div>
              <p className="text-sm text-gray-700">{pattern.context}</p>
              {pattern.triggers.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Triggers:</p>
                  <div className="flex flex-wrap gap-1">
                    {pattern.triggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Facts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Facts Worth Remembering</h3>
        </div>
        <div className="space-y-3">
          {memory.facts.map((fact, idx) => (
            <div
              key={idx}
              className={`border-l-4 pl-4 py-2 ${
                fact.importance === 'high'
                  ? 'border-blue-600'
                  : fact.importance === 'medium'
                  ? 'border-blue-400'
                  : 'border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{fact.fact}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    fact.importance === 'high'
                      ? 'bg-blue-100 text-blue-700'
                      : fact.importance === 'medium'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {fact.importance}
                </span>
              </div>
              <p className="text-xs text-gray-500">{fact.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

