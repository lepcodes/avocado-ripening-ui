import React from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import type { PredictionResponse } from '../types';

interface PredictionResultProps {
  prediction: PredictionResponse;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const getShelfLifeColor = (days: number) => {
    if (days <= 2) return 'text-red-600 bg-red-100';
    if (days <= 5) return 'text-orange-600 bg-orange-100';
    if (days <= 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getShelfLifeMessage = (days: number) => {
    if (days <= 1) return 'Consume immediately';
    if (days <= 2) return 'Consume within 1-2 days';
    if (days <= 5) return 'Good for a few more days';
    if (days <= 10) return 'Fresh for over a week';
    return 'Very fresh avocado';
  };

  const shelfLifeColorClass = getShelfLifeColor(prediction.shelfLife);
  const shelfLifeMessage = getShelfLifeMessage(prediction.shelfLife);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${shelfLifeColorClass} mb-4`}>
          <span className="text-3xl font-bold">
            {prediction.shelfLife}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Estimated Shelf Life
        </h3>
        
        <div className="text-4xl font-bold text-emerald-700 mb-2">
          {prediction.shelfLife} {prediction.shelfLife === 1 ? 'Day' : 'Days'}
        </div>
        
        <p className={`text-lg font-medium px-4 py-2 rounded-full inline-block ${shelfLifeColorClass}`}>
          {shelfLifeMessage}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Best Before</div>
          <div className="font-semibold text-gray-900">
            {new Date(Date.now() + prediction.shelfLife * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Confidence</div>
          <div className="font-semibold text-gray-900">
            {Math.round(prediction.confidence * 100)}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Ripeness</div>
          <div className="font-semibold text-gray-900 capitalize">
            {prediction.ripeness}
          </div>
        </div>
      </div>

      {prediction.tips && prediction.tips.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            💡 Storage Tips
          </h4>
          <ul className="space-y-2">
            {prediction.tips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;