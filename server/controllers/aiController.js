// server/controllers/aiController.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import DiaryEntry from "../models/diaryEntryModel.js";
import User from "../models/userModel.js";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper to get the start date for predefined ranges
function getStartDate(range) {
  const now = new Date();
  if (range === "weekly") return new Date(now.setDate(now.getDate() - 7));
  if (range === "monthly") return new Date(now.setMonth(now.getMonth() - 1));
  if (range === "yearly") return new Date(now.setFullYear(now.getFullYear() - 1));
  return null;
}

// Generate the standard personalized summary
export const generateSummary = async (req, res) => {
  try {
    const { range, customStartDate, customEndDate } = req.query;
    const query = { user: req.user._id };

    if (range === "custom") {
      if (!customStartDate || !customEndDate) {
        return res.status(400).json({ message: "Custom range requires start and end dates." });
      }
      query.createdAt = { $gte: new Date(customStartDate), $lte: new Date(customEndDate) };
    } else {
      const startDateFilter = getStartDate(range);
      if (startDateFilter) query.createdAt = { $gte: startDateFilter };
    }

    const entries = await DiaryEntry.find(query).sort({ createdAt: 1 });

    if (!entries.length) {
      return res.status(200).json({
        summary: "No diary entries were found for the selected period. Write some more to get a summary!"
      });
    }

    // Get user profile data
    const user = await User.findById(req.user._id).select("-password");
    const userProfileInfo = `
      For context, here is some information about the user. Use this to provide a more tailored analysis if relevant, but do not state it directly in the summary.
      - Gender: ${user.gender || "Not specified"}
      - Ethnicity: ${user.ethnicity || "Not specified"}
      - Date of Birth: ${user.dateOfBirth ? new Date(user.dateOfBirth).toDateString() : "Not specified"}
    `;

    const allText = entries
      .map(
        (e) =>
          `Date: ${new Date(e.createdAt).toDateString()}, Feeling: ${e.feeling || "Not specified"}\nEntry: ${e.text}`
      )
      .join("\n\n---\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      You are a thoughtful and empathetic journal assistant named The Narrative Weaver.
      ${userProfileInfo}
      Analyze the following diary entries from the user.
      ---
      ${allText}
      ---
      Please write a **personalized summary** in distinct sections, highlighting:
      - **Overall Mindset & Dominant Themes:** What are the main topics or recurring thoughts?
      - **Emotional Landscape:** What is the general mood, based on both the text and logged feelings?
      - **Self-Image & Confidence:** How does the user talk about themselves?
      - **Identified Strengths:** What are some key strengths shown in their actions or thoughts?
      - **Potential Areas for Growth:** Gently point out a recurring challenge as an opportunity.
      Make it feel warm, insightful, and base every observation directly on their writing.
    `;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    res.json({ summary: text });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ message: "Error generating summary." });
  }
};

// Generate the deeper psychoanalytic analysis
export const generateDeeperAnalysis = async (req, res) => {
  try {
    const { range, customStartDate, customEndDate } = req.query;
    const query = { user: req.user._id };

    if (range === "custom") {
      if (!customStartDate || !customEndDate) {
        return res.status(400).json({ message: "Custom range requires start and end dates." });
      }
      query.createdAt = { $gte: new Date(customStartDate), $lte: new Date(customEndDate) };
    } else {
      const startDateFilter = getStartDate(range);
      if (startDateFilter) query.createdAt = { $gte: startDateFilter };
    }

    const entries = await DiaryEntry.find(query).sort({ createdAt: 1 });

    if (!entries.length) {
      return res.status(200).json({
        analysis: "No diary entries were found for deeper analysis."
      });
    }

    // Get user profile data
    const user = await User.findById(req.user._id).select("-password");
    const userProfileInfo = `
      For context, here is some information about the user. Use this to provide a more tailored analysis if relevant.
      - Gender: ${user.gender || "Not specified"}
      - Ethnicity: ${user.ethnicity || "Not specified"}
      - Date of Birth: ${user.dateOfBirth ? new Date(user.dateOfBirth).toDateString() : "Not specified"}
    `;

    const allText = entries.map((e) => e.text).join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      You are an expert psychoanalytic interpreter.
      ${userProfileInfo}
      Analyze the following diary entries through the lens of Freudian theory.
      ---
      ${allText}
      ---
      Please provide a **deep psychological analysis** with these sections (if evidence exists):
      - **Analysis of Potential Defense Mechanisms:** Look for Repression, Rationalization, Escapism, etc.
      - **Interpretation of Potential Parapraxes (Slips):** Analyze any described slips or accidents or traumatic experience.
      - **Dream Interpretation:** If dreams are mentioned, analyze their latent content.
      - **Concluding Insight:** Synthesize findings into an insight about unconscious conflicts.
      - **Subconscious Mind:** Look for any repetitive behavioural patterns, consistent thought patterns.
      Use empathetic, professional, and cautious language ("this could suggest...").
    `;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    res.json({ analysis: text });
  } catch (error) {
    console.error("Error generating deeper analysis:", error);
    res.status(500).json({ message: "Error generating deeper analysis." });
  }
};
