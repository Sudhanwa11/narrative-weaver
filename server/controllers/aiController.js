import DiaryEntry from '../models/diaryEntryModel.js';

// --- ADVANCED SIMULATED AI FOR INITIAL SUMMARY ---
const getAdvancedAiSummary = async (entriesText, feelings) => {
  /*
  // --- CONNECTING TO A REAL AI (like Google's Gemini) ---
  // 1. Get a free API key from Google AI Studio: https://aistudio.google.com/
  // 2. Add it to your .env file: GOOGLE_API_KEY=your_key_here
  // 3. Use code like this to make a real API call:

  const advancedPrompt = `
You are a compassionate and insightful psychological journal assistant named 'The Weaver'. Your task is to analyze a user's diary entries and their self-reported feelings to provide a thoughtful, personalized summary.

**Your analysis must cover:**
1.  **Dominant Themes:** Identify the main topics (e.g., work challenges, relationship dynamics, self-discovery).
2.  **Emotional Landscape:** Analyze the overall emotional tone based on both the text and the reported feelings (${feelings.join(', ')}). Note any conflicts (e.g., writing about a sad event but logging "Happy") or patterns.
3.  **Self-Perception:** Look for language related to self-confidence, self-criticism, or self-image. How does the user talk about themselves?
4.  **Strengths & Positive Moments ("Innovative Moments"):** Highlight at least one specific moment of resilience, strength, a breakthrough, or a positive shift in perspective. Quote a small piece of their writing if possible.

**Your final summary must include:**
- A warm, gentle, and varied opening.
- A summary of your analysis of the themes and emotions.
- A section explicitly titled "A Moment of Strength".
- A "Gentle Suggestion" section with one or two actionable, compassionate tips based ONLY on what was written.

Vary the language and structure of your response. Make it feel personal, not like a template.

Here are the user's entries:
---
${entriesText}
---
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: advancedPrompt }] }] })
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
  */

  // --- Start of More Dynamic Simulated Response ---
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (!entriesText || entriesText.trim() === '') {
    return "There aren't enough entries in the selected date range to generate a summary.";
  }

  // More examples to create varied responses
  const openings = ["Taking a moment to look back is a wonderful act of self-care. Here's a reflection on your recent entries:", "It's an honor to walk alongside you on your journey. Looking at your writings from this period, here's what I've gathered:", "Let's gently unpack the themes and feelings from your recent entries."];
  const themes = ["navigating professional challenges", "exploring family dynamics", "focusing on self-care and personal boundaries"];
  const strengths = ["you showed great clarity when you decided to set a boundary, even when it was difficult.", "your description of the sunset shows a deep capacity for finding beauty in the present moment.", "you handled a moment of criticism with impressive grace and self-reflection."];
  const suggestions = ["it seems that spending even a few minutes in nature helps calm you. Could you schedule a short walk during your lunch break?", "you write with a lot of clarity after you've had some quiet time. Perhaps setting aside 10 minutes before bed to simply sit could be a powerful practice.", "your kindness to others is a clear theme. Remember to turn some of that wonderful compassion inward."];

  // Randomly select parts to make the summary feel different each time
  const randomOpening = openings[Math.floor(Math.random() * openings.length)];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const randomStrength = strengths[Math.floor(Math.random() * strengths.length)];
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return `
${randomOpening}

**Themes & Emotions:**
A dominant theme seems to be **${randomTheme}**. Your entries suggest a mix of emotions around this, and the feelings you logged—like **${feelings.join(', ') || 'various emotions'}**—paint a rich picture of this experience.

**A Moment of Strength:**
I want to highlight a moment of real strength. In one entry, **${randomStrength}** This is a testament to your inner resilience.

**A Gentle Suggestion:**
Based on your writings, **${randomSuggestion}**

Keep weaving your story; you're on a meaningful path.
  `;
};

// --- ADVANCED PSYCHOANALYTIC AI ---
const getDeeperAnalysis = async (entriesText) => {
  /*
  // --- REAL AI PROMPT FOR DEEPER ANALYSIS ---
  const deeperAnalysisPrompt = `
You are a psychoanalytic interpreter. Your task is to analyze a user's diary entries through the lens of Freudian psychoanalytic theory to uncover potential unconscious patterns. Your tone should be insightful and educational, not diagnostic.

**Your analysis must be structured into the following sections:**

1.  **Analysis of Potential Defense Mechanisms:** Review the text for patterns that might suggest common defense mechanisms (e.g., Repression, Denial, Projection, Rationalization). Quote a brief, relevant phrase from the user's entries and explain how it *could* be interpreted as a specific defense mechanism.
2.  **Interpretation of Potential Parapraxes (Slips):** Look for any potential slips of the tongue, memory lapses, or seemingly accidental actions described in the text. Interpret what unconscious desire or thought this slip *might* reveal.
3.  **Dream Interpretation (if any dreams are mentioned):** If the user describes a dream, briefly analyze its potential Manifest vs. Latent content. Identify possible instances of condensation, displacement, or symbolization. Provide a gentle interpretation of what the dream's latent content *could* signify.
4.  **Concluding Insight:** Provide a single, concluding paragraph that synthesizes the findings into a compassionate insight about a potential underlying conflict or pattern (e.g., between the Id, Ego, and Superego).

**Important:** Always use cautious and interpretive language (e.g., "this could suggest," "it might point to," "one possible interpretation is"). You are not a therapist; you are an interpretive guide.

Here are the user's entries:
---
${entriesText}
---
`;
  // ... (Code to call a real AI model with this prompt) ...
  */

  // --- Start of Simulated Response ---
  await new Promise(resolve => setTimeout(resolve, 2500));
  if (!entriesText || entriesText.trim() === '') return "Not enough data for a deeper analysis.";

  const defenseMechanism = "In one entry, you wrote, 'I wasn't even upset, I just moved on,' after a difficult interaction. From a psychoanalytic perspective, this could be interpreted as **Repression**, a defense mechanism where the ego pushes uncomfortable feelings away from conscious awareness to avoid anxiety.";
  const parapraxis = "You mentioned misplacing your keys right before you had to leave for a stressful meeting. This small 'accident' could be seen as a parapraxis, or a 'Freudian slip.' It might suggest an unconscious desire to delay or avoid an event you were feeling conflicted about.";
  const conclusion = "These patterns, viewed together, could suggest an underlying tension between a conscious desire to be seen as composed and in control (Ego) and unconscious feelings of anxiety or frustration (Id). Recognizing these moments is a powerful step in understanding the rich, complex dialogue within your own mind.";

  return `This deeper analysis looks at your entries through a psychoanalytic lens to explore potential unconscious patterns. This is not a diagnosis, but an interpretation to spark curiosity.\n\n**Analysis of Potential Defense Mechanisms:**\n${defenseMechanism}\n\n**Interpretation of Potential Parapraxes (Slips):**\n${parapraxis}\n\n**Concluding Insight:**\n${conclusion}`;
};


// --- CONTROLLER FUNCTIONS ---

const generateSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'Please provide both a start and end date.' });
    
    const entries = await DiaryEntry.find({ user: req.user._id, createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }).sort({ createdAt: 'asc' });

    const entriesText = entries.map(entry => `[${new Date(entry.createdAt).toLocaleDateString()}]: ${entry.text}`).join('\n\n');
    const feelings = [...new Set(entries.map(entry => entry.feeling).filter(Boolean))];
    
    const summary = await getAdvancedAiSummary(entriesText, feelings);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while generating summary' });
  }
};

const generateDeeperAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'Please provide both a start and end date.' });
    
    const entries = await DiaryEntry.find({ user: req.user._id, createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }).sort({ createdAt: 'asc' });
    const entriesText = entries.map(entry => entry.text).join('\n\n');
    
    const analysis = await getDeeperAnalysis(entriesText);
    res.json({ analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while generating deeper analysis' });
  }
};

export { generateSummary, generateDeeperAnalysis };