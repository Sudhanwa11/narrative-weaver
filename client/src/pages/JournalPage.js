// client/src/pages/JournalPage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEntries, deleteEntry, reset } from '../features/diary/diarySlice';

function JournalPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { entries, isLoading, isError, message } = useSelector(
    (state) => state.diary
  );

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

  if (isLoading) {
    return <div>Loading your journal...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Journal Archive</h2>
      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry._id} className="relative bg-white/50 p-4 rounded-lg shadow-md border border-wood">
              <button
                onClick={() => dispatch(deleteEntry(entry._id))}
                className="absolute top-2 right-2 text-ink/50 hover:text-red-500 font-bold text-xl"
              >
                &times;
              </button>
              <p className="text-sm text-ink/60 mb-2 font-semibold">
                {new Date(entry.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="pr-4">{entry.text}</p>
              {entry.feeling && (
                <span className="inline-block bg-gold/30 text-ink font-semibold text-sm mt-2 px-2 py-1 rounded-full">
                  {entry.feeling}
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">Your journal is empty. Write your first entry!</p>
        )}
      </div>
    </div>
  );
}

export default JournalPage;