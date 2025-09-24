import React from 'react';
import { Check } from 'lucide-react';

interface DefaultImage {
  id: string;
  url: string;
  name: string;
  description: string;
  ripeness: 'unripe' | 'ripe' | 'overripe';
}

interface DefaultImageSelectorProps {
  onImageSelect: (imageUrl: string, imageName: string) => void;
  selectedImageUrl?: string;
}

const defaultImages: DefaultImage[] = [
  {
    id: 'unripe-avocado',
    url: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    name: 'Unripe Avocado',
    description: 'Hard, bright green avocado',
    ripeness: 'unripe'
  },
  {
    id: 'ripe-avocado',
    url: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    name: 'Perfect Ripe Avocado',
    description: 'Ready to eat, dark green',
    ripeness: 'ripe'
  },
  {
    id: 'very-ripe-avocado',
    url: 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    name: 'Very Ripe Avocado',
    description: 'Soft, darker skin',
    ripeness: 'ripe'
  },
  {
    id: 'overripe-avocado',
    url: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    name: 'Overripe Avocado',
    description: 'Very soft, brown spots',
    ripeness: 'overripe'
  }
];

const DefaultImageSelector: React.FC<DefaultImageSelectorProps> = ({ 
  onImageSelect, 
  selectedImageUrl 
}) => {
  const getRipenessColor = (ripeness: string) => {
    switch (ripeness) {
      case 'unripe': return 'bg-red-100 text-red-700';
      case 'ripe': return 'bg-green-100 text-green-700';
      case 'overripe': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Or, choose a sample avocado:
        </h3>
        <p className="text-sm text-gray-600">
          Test the model with these sample images representing different ripeness stages
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultImages.map((image) => (
          <div
            key={image.id}
            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              selectedImageUrl === image.url
                ? 'border-emerald-500 shadow-lg'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
            onClick={() => onImageSelect(image.url, image.name)}
          >
            <div className="aspect-square relative">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {selectedImageUrl === image.url && (
                <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-emerald-500 rounded-full p-2">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <div className="text-white">
                  <div className="text-sm font-medium mb-1">{image.name}</div>
                  <div className="text-xs opacity-90">{image.description}</div>
                </div>
              </div>
              
              <div className="absolute top-2 right-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRipenessColor(image.ripeness)}`}>
                  {image.ripeness}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultImageSelector;