import type { PredictionResponse, FeedbackData } from '../types';

// Configuration for your backend API
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for development - replace with actual API calls
const mockPredictionData: PredictionResponse = {
  shelfLife: Math.floor(Math.random() * 14) + 1, // Random 1-14 days
  confidence: 0.85 + Math.random() * 0.14, // Random 0.85-0.99
  ripeness: ['unripe', 'ripe', 'overripe'][Math.floor(Math.random() * 3)] as any,
  tips: [
    'Store at room temperature to ripen faster',
    'Place in refrigerator once ripe to extend shelf life',
    'Keep away from direct sunlight',
    'Store with bananas to accelerate ripening'
  ].slice(0, Math.floor(Math.random() * 3) + 1),
  timestamp: new Date().toISOString(),
};

export const uploadImageAndPredict = async (
  image: File | { url: string; name: string }, 
  temperature: string
): Promise<PredictionResponse> => {
  // Create FormData for image upload
  const formData = new FormData();
  
  // Handle both File objects and default image objects
  if (image instanceof File) {
    formData.append('image', image);
  } else {
    // For default images, we'll send the URL and name
    formData.append('imageUrl', image.url);
    formData.append('imageName', image.name);
  }
  
  formData.append('temperature', temperature);

  try {
    // For development, use mock data with artificial delay
    if (import.meta.env.DEV) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      // Simulate occasional API failures for testing error handling
      if (Math.random() < 0.1) {
        throw new Error('Simulated API error for testing');
      }
      
      return {
        ...mockPredictionData,
        shelfLife: Math.floor(Math.random() * 14) + 1,
        confidence: 0.85 + Math.random() * 0.14,
      };
    }

    // Production API call
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header - let the browser set it with boundary for FormData
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Prediction API error:', error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData: FeedbackData): Promise<void> => {
  const formData = new FormData();
  
  // Handle both File objects and default image objects
  if (feedbackData.image instanceof File) {
    formData.append('image', feedbackData.image);
  } else {
    formData.append('imageUrl', feedbackData.image.url);
    formData.append('imageName', feedbackData.image.name);
  }
  
  formData.append('temperature', feedbackData.temperature);
  formData.append('prediction', feedbackData.prediction.toString());
  formData.append('feedback', feedbackData.feedback);
  formData.append('timestamp', feedbackData.timestamp);

  try {
    // For development, simulate API call
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Feedback submitted (dev mode):', feedbackData);
      return;
    }

    // Production API call
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Feedback submission failed with status ${response.status}`);
    }

  } catch (error) {
    console.error('Feedback API error:', error);
    throw error;
  }
};

// Example backend endpoint structure for your reference:
/*

Backend API Endpoints:

POST /api/predict
- Accepts: multipart/form-data with 'image' file and 'temperature' string
- Returns: JSON with PredictionResponse structure
- Example response:
{
  "shelfLife": 7,
  "confidence": 0.92,
  "ripeness": "ripe",
  "tips": ["Store in refrigerator", "Consume within a week"],
  "timestamp": "2024-01-15T10:30:00Z"
}

POST /api/feedback
- Accepts: multipart/form-data with image, temperature, prediction, feedback, timestamp
- Returns: 200 OK on success
- Stores feedback for model improvement

*/