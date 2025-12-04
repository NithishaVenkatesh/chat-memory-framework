'use client';

import { MessageSquare, Sparkles } from 'lucide-react';

interface ResponseComparisonProps {
  originalResponse: string | null;
  transformedResponse: string | null;
  personalityName: string;
}

export default function ResponseComparison({
  originalResponse,
  transformedResponse,
  personalityName,
}: ResponseComparisonProps) {
  if (!originalResponse && !transformedResponse) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">
          Send a message and select a personality to see the comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Response */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Original (Neutral)</h4>
          </div>
          <div className="bg-gray-50 rounded p-3 min-h-[100px]">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {originalResponse || 'No response generated yet.'}
            </p>
          </div>
        </div>

        {/* Transformed Response */}
        <div className="border-2 border-primary-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900">
              Transformed ({personalityName})
            </h4>
          </div>
          <div className="bg-primary-50 rounded p-3 min-h-[100px]">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {transformedResponse || 'No transformed response yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

