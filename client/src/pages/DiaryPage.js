// client/src/pages/DiaryPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEntries, createEntry, reset } from '../features/diary/diarySlice';

function DiaryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  // We still get all entries, but we will filter them
  const { entries, isLoading, isError, message } = useSelector(
    (state) => state.diary
  );

  const [text, setText] = useState('');
  const [feeling, setFeeling] = useState('');

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getEntries());
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createEntry({ text, feeling }));
    setText('');
    setFeeling('');
  };

  // Filter for today's entries
  const todaysEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    return entryDate === today;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">New Entry</h2>
        <form onSubmit={onSubmit} className="bg-white/50 p-6 rounded-lg shadow-md border border-wood">
          <div className="mb-4">
            <label htmlFor="text" className="block text-ink font-bold mb-2">
              What's on your mind?
            </label>
            <textarea
              id="text"
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40 p-2 border rounded border-wood/50 focus:outline-none focus:border-gold"
              placeholder="Start writing..."
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="feeling" className="block text-ink font-bold mb-2">
              How are you feeling?
            </label>
            <select
              id="feeling"
              name="feeling"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="w-full p-2 border rounded border-wood/50 focus:outline-none focus:border-gold"
            >
              <option value="">-- Select a feeling --</option>
              <option value="Happy">Happy</option>
              <option value="Sad">Sad</option>
              <option value="Anxious">Anxious</option>
              <option value="Excited">Excited</option>
              <option value="Calm">Calm</option>
              <option value="Angry">Angry</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-wood text-white font-bold py-2 px-4 rounded hover:bg-ink transition-colors">
            Save Entry
          </button>
        </form>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Today's Entries</h2>
        <div className="space-y-4">
          {todaysEntries.length > 0 ? (
            todaysEntries.map((entry) => (
              <div key={entry._id} className="bg-white/50 p-4 rounded-lg shadow-md border border-wood">
                <p className="text-sm text-ink/60 mb-2">
                  {new Date(entry.createdAt).toLocaleTimeString()}
                </p>
                <p>{entry.text}</p>
                {entry.feeling && (
                  <span className="inline-block bg-gold/30 text-ink font-semibold text-sm mt-2 px-2 py-1 rounded-full">
                    {entry.feeling}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p>You haven't written anything yet today.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiaryPage;