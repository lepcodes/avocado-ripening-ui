import React from 'react';
import { Thermometer } from 'lucide-react';

interface TemperatureSelectorProps {
  selectedTemperature: string;
  onTemperatureChange: (temperature: string) => void;
}

const temperatureOptions = [
  { 
    value: '20°C', 
    label: '20°C', 
    description: 'Room temperature storage',
    color: 'text-red-600'
  },
  { 
    value: '10°C', 
    label: '10°C', 
    description: 'Cool storage (pantry)',
    color: 'text-blue-600'
  },
  { 
    value: 'Ambient', 
    label: 'Ambient Temperature', 
    description: 'Current room conditions',
    color: 'text-green-600'
  },
];

const TemperatureSelector: React.FC<TemperatureSelectorProps> = ({ 
  selectedTemperature, 
  onTemperatureChange 
}) => {
  return (
    <div className="space-y-3">
      {temperatureOptions.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedTemperature === option.value
              ? 'border-emerald-500 bg-emerald-50 shadow-md'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25'
          }`}
        >
          <input
            type="radio"
            name="temperature"
            value={option.value}
            checked={selectedTemperature === option.value}
            onChange={(e) => onTemperatureChange(e.target.value)}
            className="sr-only"
          />
          
          <div className="flex items-center space-x-4 flex-1">
            <div className={`p-3 rounded-full ${
              selectedTemperature === option.value ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <Thermometer className={`w-6 h-6 ${
                selectedTemperature === option.value ? 'text-emerald-600' : 'text-gray-500'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium text-gray-900">
                  {option.label}
                </span>
                <span className={`text-lg font-semibold ${option.color}`}>
                  {option.value === 'Ambient' ? '🌡️' : '❄️'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {option.description}
              </p>
            </div>
            
            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
              selectedTemperature === option.value
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-gray-300'
            }`}>
              {selectedTemperature === option.value && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default TemperatureSelector;