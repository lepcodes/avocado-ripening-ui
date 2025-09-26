import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import DefaultImageSelector from './components/DefaultImageSelector';
import TemperatureSelector from './components/TemperatureSelector';
import PredictionResult from './components/PredictionResult';
import FeedbackForm from './components/FeedbackForm';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import { Leaf } from 'lucide-react';
import { uploadImageAndPredict, submitFeedback } from './utils/api';
import type { PredictionResponse, FeedbackData } from './types';

function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedDefaultImage, setSelectedDefaultImage] = useState<{ url: string; name: string } | null>(null);
  const [selectedTemperature, setSelectedTemperature] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setSelectedDefaultImage(null); // Clear default image when user uploads
    setPrediction(null);
    setShowFeedback(false);
    setError('');
  };

  const handleDefaultImageSelect = (imageUrl: string, imageName: string) => {
    setSelectedDefaultImage({ url: imageUrl, name: imageName });
    setUploadedImage(null); // Clear uploaded image when user selects default
    setPrediction(null);
    setShowFeedback(false);
    setError('');
  };

  const handleTemperatureChange = (temperature: string) => {
    setSelectedTemperature(temperature);
  };

  const handleGetPrediction = async () => {
    if ((!uploadedImage && !selectedDefaultImage) || !selectedTemperature) {
      setError('Please upload an image and select a temperature before getting prediction.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use uploaded image if available, otherwise use selected default image
      const imageToUse = uploadedImage || selectedDefaultImage;
      if (!imageToUse) {
        throw new Error('No image selected');
      }
      const result = await uploadImageAndPredict(imageToUse, selectedTemperature);
      console.log('Prediction result:', result);
      setPrediction(result);
      setShowFeedback(true);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackText: string) => {
    if (!prediction || (!uploadedImage && !selectedDefaultImage)) return;

    try {
      const feedbackData: FeedbackData = {
        image: (uploadedImage || selectedDefaultImage)!,
        temperature: selectedTemperature,
        prediction: prediction.shelfLife,
        feedback: feedbackText,
        timestamp: new Date().toISOString(),
      };

      await submitFeedback(feedbackData);
      setToast({ message: 'Thank you for your feedback!', type: 'success' });
      setShowFeedback(false);
    } catch (err) {
      setToast({ message: 'Failed to submit feedback. Please try again.', type: 'error' });
      console.error('Feedback error:', err);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedDefaultImage(null);
    setSelectedTemperature('');
    setPrediction(null);
    setShowFeedback(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-12 h-12 text-emerald-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Avocado Shelf Life Predictor
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of your avocado and select the storage temperature to get an accurate
            prediction of its remaining shelf life using advanced deep learning technology.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Step 1: Image Upload */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upload Avocado Image</h2>
            </div>
            <ImageUpload onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
          </div>

          {/* Default Image Selection */}
          {!uploadedImage && (
            <div className="mb-8">
              <DefaultImageSelector 
                onImageSelect={handleDefaultImageSelect}
                selectedImageUrl={selectedDefaultImage?.url}
              />
            </div>
          )}

          {/* Step 2: Temperature Selection */}
          {(uploadedImage || selectedDefaultImage) && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Select Storage Temperature</h2>
              </div>
              <TemperatureSelector
                selectedTemperature={selectedTemperature}
                onTemperatureChange={handleTemperatureChange}
              />
            </div>
          )}

          {/* Get Prediction Button */}
          {(uploadedImage || selectedDefaultImage) && selectedTemperature && (
            <div className="mb-8 text-center">
              <button
                onClick={handleGetPrediction}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                {isLoading ? 'Processing...' : 'Get Prediction'}
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="mb-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Step 3: Prediction Result */}
          {prediction && !isLoading && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Prediction Result</h2>
              </div>
              <PredictionResult prediction={prediction} />
            </div>
          )}

          {/* Step 4: Feedback Form */}
          {showFeedback && prediction && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  4
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Share Your Opinion</h2>
              </div>
              <FeedbackForm onFeedbackSubmit={handleFeedbackSubmit} />
            </div>
          )}

          {/* Reset Button */}
          {(uploadedImage || selectedDefaultImage || prediction) && (
            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by advanced deep learning technology for accurate avocado freshness prediction.</p>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;