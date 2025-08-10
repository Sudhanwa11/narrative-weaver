import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEntries, createEntry, deleteEntry, updateEntry, reset } from '../features/diary/diarySlice';
import EntryActionsMenu from '../components/EntryActionsMenu';
import ConfirmationModal from '../components/ConfirmationModal';

function DiaryPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    // Get the new isDeleting state from Redux
    const { entries, isLoading, isDeleting } = useSelector((state) => state.diary);

    // --- State for the new entry form ---
    const [text, setText] = useState('');
    const [feeling, setFeeling] = useState('');
    
    // --- State for editing and the delete confirmation modal ---
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(getEntries());
        }
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createEntry({ text, feeling }));
        setText('');
        setFeeling('');
    };
    
    // --- Handlers for Modal and Editing ---
    const handleDeleteRequest = (entryId) => {
        setEntryToDelete(entryId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (entryToDelete) {
            dispatch(deleteEntry(entryToDelete));
        }
        setIsModalOpen(false);
        setEntryToDelete(null);
    };
    
    const handleStartEdit = (entry) => {
        setEditingEntryId(entry._id);
        setEditedText(entry.text);
    };

    const handleCancelEdit = () => {
        setEditingEntryId(null);
        setEditedText('');
    };

    const handleSaveEdit = (entryId) => {
        dispatch(updateEntry({ _id: entryId, text: editedText }));
        handleCancelEdit();
    };

    const todaysEntries = entries.filter(entry => 
        new Date(entry.createdAt).toLocaleDateString() === new Date().toLocaleDateString()
    );

    return (
        <>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this entry?"
            />
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Entry Form Section */}
                <div className="w-full max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center">New Entry</h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="text-area" className="block text-lg font-semibold mb-2">What's on your mind?</label>
                            <textarea
                                id="text-area"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-48 p-3 bg-white/50 dark:bg-dark-wood/20 border border-wood dark:border-dark-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold dark:focus:ring-dark-gold"
                                placeholder="Start writing..."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="feeling-select" className="block text-lg font-semibold mb-2">How are you feeling?</label>
                            <select
                                id="feeling-select"
                                value={feeling}
                                onChange={(e) => setFeeling(e.target.value)}
                                className="w-full p-3 bg-white/50 dark:bg-dark-wood/20 border border-wood dark:border-dark-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-gold dark:focus:ring-dark-gold"
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
                        <button type="submit" className="w-full bg-wood dark:bg-dark-gold text-white dark:text-ink font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-lg">
                            Save Entry
                        </button>
                    </form>
                </div>

                {/* Today's Entries Section */}
                <div className="w-full max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center">Today's Entries</h2>
                    <div className="space-y-4">
                        {isLoading && todaysEntries.length === 0 ? <p>Loading...</p> : 
                            todaysEntries.length > 0 ? (
                                todaysEntries.map((entry) => (
                                    <div 
                                      key={entry._id} 
                                      className={`relative bg-white/50 dark:bg-dark-wood/20 p-4 rounded-lg shadow-md border border-wood dark:border-dark-gold transition-opacity ${
                                        isDeleting === entry._id ? 'opacity-50' : 'opacity-100'
                                      }`}
                                    >
                                        {editingEntryId === entry._id ? (
                                            <div>
                                                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full h-24 p-2 bg-parchment dark:bg-dark-bg border border-gold dark:border-dark-gold rounded-md focus:outline-none" autoFocus />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleCancelEdit} className="py-1 px-3 rounded text-sm hover:bg-gray-300/50 dark:hover:bg-gray-600/50">Cancel</button>
                                                    <button onClick={() => handleSaveEdit(entry._id)} className="py-1 px-3 rounded text-sm bg-wood dark:bg-dark-gold text-white dark:text-ink hover:opacity-90">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <EntryActionsMenu onDelete={() => handleDeleteRequest(entry._id)} onEdit={() => handleStartEdit(entry)} />
                                                <p className="text-sm text-ink/60 dark:text-dark-ink/60 mb-2 font-semibold">{new Date(entry.createdAt).toLocaleTimeString()}</p>
                                                <p className="pr-8 whitespace-pre-wrap">{entry.text}</p>
                                                {entry.feeling && (<span className="inline-block bg-gold/30 dark:bg-dark-gold/30 text-ink dark:text-dark-ink font-semibold text-sm mt-2 px-2 py-1 rounded-full">{entry.feeling}</span>)}
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-ink/70 dark:text-dark-ink/70">You haven't written anything yet today.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default DiaryPage;