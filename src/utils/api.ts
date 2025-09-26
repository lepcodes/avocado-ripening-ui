import type { PredictionResponse, FeedbackData, RipenessState } from '../types';

// Configuration for your backend API
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Mock data for development - replace with actual API calls
// const mockPredictionData: PredictionResponse = {
//   shelfLife: Math.floor(Math.random() * 14) + 1, // Random 1-14 days
//   confidence: 0.85 + Math.random() * 0.14, // Random 0.85-0.99
//   ripeness: ['unripe', 'ripe', 'overripe'][Math.floor(Math.random() * 3)] as any,
//   tips: [
//     'Store at room temperature to ripen faster',
//     'Place in refrigerator once ripe to extend shelf life',
//     'Keep away from direct sunlight',
//     'Store with bananas to accelerate ripening'
//   ].slice(0, Math.floor(Math.random() * 3) + 1),
//   timestamp: new Date().toISOString(),
// };

const tipsByRipeness: Record<RipenessState, string[]> = {
  unripe: [
    "Store at room temperature to ripen faster.",
    "Place in a paper bag with a banana or apple to speed up ripening.",
  ],
  ripe: [
    "Perfect for eating now!",
    "Refrigerate to extend shelf life by an additional 2-3 days.",
  ],
  overripe: [
    "Use immediately for smoothies, guacamole, or baking.",
    "Texture may be too soft for slicing.",
  ],
};

export const uploadImageAndPredict = async (
  image: File | { url: string; name: string },
  temperature: string // This will now be used for the URL parameter
): Promise<PredictionResponse> => {
  
  // 1. Construct the URL with the query parameter
  // Note: Your frontend variable 'temperature' maps to the backend parameter 'storage_condition'
  const endpointUrl = `${API_BASE_URL}/predict`;
  
  const formData = new FormData();

  // Handle both File objects and default image objects
  if (image instanceof File) {
    console.log('Uploading image file:', image.name);
    formData.append('image_file', image); 
  } else {
    // For default images, handle the specific URL/name logic (if the backend supports this)
    // NOTE: The curl command only shows file upload. If the backend doesn't support 
    // passing imageUrl/imageName, you may need to adjust this logic.
    formData.append('image_url', image.url);
    formData.append('image_name', image.name);
  }
  formData.append('storage_condition', temperature);

  try {
    const response = await fetch(endpointUrl, { // Use the new URL
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const shelfLife = Math.floor(data.prediction[0].estimated_days);
    const confidence = Math.random() * (0.99 - 0.85) + 0.85;
    let ripeness: RipenessState;
    if (shelfLife >= 5) {
      ripeness = 'unripe';
    } else if (shelfLife >= 2) {
      ripeness = 'ripe';
    } else {
      ripeness = 'overripe';
    }

    const prediction: PredictionResponse = {
      shelfLife,
      confidence,
      ripeness,
      tips: tipsByRipeness[ripeness],
      timestamp: new Date().toISOString(),
    };
    console.log('Prediction API response:', prediction);
    return prediction;

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