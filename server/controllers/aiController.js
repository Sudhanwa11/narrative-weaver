import DiaryEntry from '../models/diaryEntryModel.js';

// --- SIMULATED AI SERVICE ---
// In a real application, this function would make an API call to an AI service.
// You would pass the 'text' to the AI with a prompt.
const getAiSummary = async (text) => {
  /*
  // Example prompt you might send to an AI model:
  const prompt = `The following is a series of diary entries from a user over the last month. Please analyze them for recurring themes, overall sentiment, and identify any "Innovative Moments" where the user expressed significant positive change, resilience, or a shift in perspective. Provide a compassionate and insightful summary of their experience. Entries: ${text}`;

  // Example of a real API call using fetch:
  const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 150
      })
  });
  const data = await response.json();
  return data.choices[0].text;
  */

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulated AI Response
  if (!text || text.trim() === '') {
    return "There weren't enough entries in the last 30 days to generate a summary. Keep writing to unlock your monthly recap!";
  }

  return `Based on your entries this month, a key theme has been your focus on professional growth, which seems to bring both excitement and a bit of anxiety. Your overall sentiment has been largely positive. A notable "Innovative Moment" occurred around the 15th, where you wrote about successfully handling a challenging project. This entry stands out as a moment of significant confidence and capability. Keep nurturing that strength!`;
};
// --- END OF SIMULATED AI SERVICE ---


/**
 * @desc    Generate a monthly summary of diary entries
 * @route   GET /api/ai/summary
 * @access  Private
 */
const generateMonthlySummary = async (req, res) => {
  try {
    // 1. Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Find all entries for the logged-in user from the last 30 days
    const entries = await DiaryEntry.find({
      user: req.user._id,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 'asc' });

    if (entries.length === 0) {
      return res.json({ summary: "You haven't written any entries in the last 30 days. Write a few to get your first summary!" });
    }

    // 3. Concatenate the text of all entries into a single string
    const entriesText = entries.map(entry => `[${new Date(entry.createdAt).toLocaleDateString()} - Feeling: ${entry.feeling || 'N/A'}]: ${entry.text}`).join('\n\n');

    // 4. Send the text to the (simulated) AI service for analysis
    const summary = await getAiSummary(entriesText);

    // 5. Return the summary to the client
    res.json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while generating summary' });
  }
};

export { generateMonthlySummary };