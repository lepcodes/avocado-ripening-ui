import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

interface FeedbackFormProps {
  onFeedbackSubmit: (feedback: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedback.trim()) {
      setIsSubmitting(true);
      try {
        await onFeedbackSubmit(feedback.trim());
        setFeedback('');
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    onFeedbackSubmit('');
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center mb-4">
        <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          How accurate was this prediction?
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Your feedback helps us improve our model's accuracy. Share your thoughts about the prediction, 
        the actual shelf life you observed, or any other relevant observations.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Example: The prediction was spot on! The avocado stayed fresh for exactly 7 days as predicted..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            disabled={isSubmitting}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.length}/500 characters
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
            disabled={isSubmitting}
          >
            Skip this step
          </button>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!feedback.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;