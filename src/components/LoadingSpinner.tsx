import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-200 rounded-full border-t-transparent animate-pulse"></div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analyzing Your Avocado
        </h3>
        <p className="text-sm text-gray-600 max-w-md">
          Our AI is carefully examining the image and processing the storage conditions 
          to provide you with the most accurate shelf life prediction...
        </p>
      </div>

      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;