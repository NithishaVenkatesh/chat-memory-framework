'use client';

import { PersonalityType } from '@/lib/types';
import { PERSONALITY_CONFIGS } from '@/lib/personality-engine';

interface PersonalitySelectorProps {
  selected: PersonalityType;
  onSelect: (type: PersonalityType) => void;
}

export default function PersonalitySelector({ selected, onSelect }: PersonalitySelectorProps) {
  const personalities = Object.values(PERSONALITY_CONFIGS);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Engine</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {personalities.map((personality) => (
          <button
            key={personality.type}
            onClick={() => onSelect(personality.type)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selected === personality.type
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{personality.name}</h4>
              {selected === personality.type && (
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{personality.description}</p>
            <p className="text-xs text-gray-500 italic">&quot;{personality.tone}&quot;</p>
          </button>
        ))}
      </div>
    </div>
  );
}

