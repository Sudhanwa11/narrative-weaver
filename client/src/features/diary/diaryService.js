import axios from 'axios';

const API_URL = 'http://localhost:5001/api/diary/';

// Create new diary entry
const createEntry = async (entryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, entryData, config);
  return response.data;
};

// Get user diary entries
const getEntries = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Delete user diary entry
const deleteEntry = async (entryId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + entryId, config);
  return response.data;
};

const updateEntry = async (entryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + entryData._id, entryData, config);
  return response.data;
};


const diaryService = {
  createEntry,
  getEntries,
  deleteEntry,
  updateEntry,
};

export default diaryService;