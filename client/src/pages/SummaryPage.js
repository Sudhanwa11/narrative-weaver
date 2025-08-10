import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function SummaryPage() {
  const { user } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('http://localhost:5001/api/ai/summary', config);
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Your Monthly Recap</h2>
      <p className="text-ink/80 mb-8">
        Click the button below to generate an AI-powered summary of your journal entries from the last 30 days. This recap will highlight themes, sentiments, and moments of growth.
      </p>

      <button
        onClick={handleGenerateSummary}
        disabled={isLoading}
        className="bg-gold text-ink font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing Your Narrative...' : 'Generate My Summary'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {summary && (
        <div className="mt-10 p-6 bg-white/60 border border-wood rounded-lg shadow-lg text-left">
          <h3 className="text-2xl font-bold mb-4">This Month's Reflection</h3>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryPage;