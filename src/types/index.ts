export interface PredictionResponse {
  shelfLife: number;
  confidence: number;
  ripeness: 'unripe' | 'ripe' | 'overripe';
  tips: string[];
  timestamp: string;
}

export interface FeedbackData {
  image: File | { url: string; name: string };
  temperature: string;
  prediction: number;
  feedback: string;
  timestamp: string;
}

export interface APIError {
  message: string;
  code?: string;
  details?: string;
}