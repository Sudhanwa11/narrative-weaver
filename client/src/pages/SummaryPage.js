import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SummaryPage() {
  const { user } = useSelector((state) => state.auth);

  // State for the UI
  const [summary, setSummary] = useState('');
  const [deeperAnalysis, setDeeperAnalysis] = useState(''); // State for the new analysis
  const [isLoading, setIsLoading] = useState(false);
  const [isDeeperLoading, setIsDeeperLoading] = useState(false); // Separate loading state
  const [error, setError] = useState('');
  
  // State for date range selection
  const [summaryType, setSummaryType] = useState('monthly');
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [summarizedRange, setSummarizedRange] = useState('');

  // Store the last used date range to use for the "Go Deeper" analysis
  const [lastDateRange, setLastDateRange] = useState(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    setDeeperAnalysis(''); // Reset deeper analysis when a new summary is generated

    let startDate, endDate;
    const today = new Date();
    
    // Calculate date range based on selected type
    switch (summaryType) {
      case 'weekly':
        startDate = new Date(new Date().setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'yearly':
        startDate = new Date(new Date().setFullYear(today.getFullYear() - 1));
        endDate = new Date();
        break;
      case 'custom':
        startDate = customStartDate;
        endDate = customEndDate;
        break;
      default:
        startDate = new Date(new Date().setMonth(today.getMonth() - 1));
        endDate = new Date();
        break;
    }

    // Save the date range for the "Go Deeper" function
    setLastDateRange({ startDate, endDate });
    setSummarizedRange(`Summary for ${startDate.toLocaleDateString('en-US')} - ${endDate.toLocaleDateString('en-US')}`);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
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

  const handleGoDeeper = async () => {
    if (!lastDateRange) return; // Don't run if no summary has been generated yet

    setIsDeeperLoading(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          startDate: lastDateRange.startDate.toISOString(),
          endDate: lastDateRange.endDate.toISOString(),
        }
      };
      const response = await axios.get('http://localhost:5001/api/ai/deeper-analysis', config);
      setDeeperAnalysis(response.data.analysis);
    } catch (err) {
      setError('Failed to generate deeper analysis.');
      console.error(err);
    } finally {
      setIsDeeperLoading(false);
    }
  };

  const SummaryTypeButton = ({ type, label }) => (
    <button
      onClick={() => setSummaryType(type)}
      className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
        summaryType === type 
          ? 'bg-wood dark:bg-dark-gold text-white dark:text-ink' 
          : 'bg-white/50 dark:bg-dark-wood/20 hover:bg-gold/20 dark:hover:bg-dark-gold/20'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Generate a Reflection</h2>
      <p className="text-ink/80 dark:text-dark-ink/80 mb-6">Select a time period and allow the AI to weave together a summary of your narrative.</p>
      
      <div className="flex justify-center gap-2 mb-4">
        <SummaryTypeButton type="weekly" label="Last 7 Days" />
        <SummaryTypeButton type="monthly" label="Last 30 Days" />
        <SummaryTypeButton type="yearly" label="Last Year" />
        <SummaryTypeButton type="custom" label="Custom Range" />
      </div>

      {summaryType === 'custom' && (
        <div className="flex justify-center items-center gap-4 my-4 p-4 bg-white/50 dark:bg-dark-wood/20 rounded-lg">
          <div>
            <label className="block text-sm font-bold mb-1">Start Date</label>
            <DatePicker selected={customStartDate} onChange={(date) => setCustomStartDate(date)} className="p-2 rounded border border-wood/50 dark:bg-dark-bg" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">End Date</label>
            <DatePicker selected={customEndDate} onChange={(date) => setCustomEndDate(date)} className="p-2 rounded border border-wood/50 dark:bg-dark-bg" />
          </div>
        </div>
      )}

      <button onClick={handleGenerateSummary} disabled={isLoading} className="bg-gold text-ink dark:bg-dark-gold dark:text-ink font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-colors disabled:bg-gray-400">
        {isLoading ? 'Analyzing...' : 'Generate My Summary'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {summary && (
        <div className="mt-10 p-6 bg-white/60 dark:bg-dark-wood/20 border border-wood dark:border-dark-gold rounded-lg shadow-lg text-left">
          <h3 className="text-2xl font-bold mb-2">This Period's Reflection</h3>
          <p className="text-sm text-ink/70 dark:text-dark-ink/70 mb-4">{summarizedRange}</p>
          <p className="text-lg text-ink dark:text-dark-ink leading-relaxed whitespace-pre-wrap">{summary}</p>

          {/* "Go Deeper" button appears after the initial summary is loaded */}
          {!deeperAnalysis && (
            <div className="text-center mt-6">
              <button onClick={handleGoDeeper} disabled={isDeeperLoading} className="bg-ink dark:bg-dark-ink text-white dark:text-dark-bg font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity">
                {isDeeperLoading ? 'Delving Deeper...' : 'Go Deeper →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* The deeper analysis is displayed in its own separate, distinct section */}
      {deeperAnalysis && (
        <div className="mt-6 p-6 bg-white/60 dark:bg-dark-wood/20 border-2 border-dashed border-wood dark:border-dark-gold rounded-lg shadow-lg text-left">
          <h3 className="text-2xl font-bold mb-4">A Psychoanalytic Perspective</h3>
          <p className="text-lg text-ink dark:text-dark-ink leading-relaxed whitespace-pre-wrap">{deeperAnalysis}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryPage;