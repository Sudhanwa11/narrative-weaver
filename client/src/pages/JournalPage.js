// client/src/pages/JournalPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEntries, deleteEntry, updateEntry, reset } from '../features/diary/diarySlice';
import EntryActionsMenu from '../components/EntryActionsMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import Calendar from 'react-calendar'; // 1. Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // 2. Import the calendar's base styles

function JournalPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { entries, isLoading, isDeleting } = useSelector((state) => state.diary);

    // --- State for Calendar and Filtering ---
    const [selectedDate, setSelectedDate] = useState(new Date());

    // --- State for Editing and Deleting ---
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    useEffect(() => {
        if (!user) navigate('/login');
        else dispatch(getEntries());
        return () => dispatch(reset());
    }, [user, navigate, dispatch]);

    // --- This filters entries to show only those from the date selected on the calendar ---
    const filteredEntries = useMemo(() => {
        return entries.filter(entry => 
            new Date(entry.createdAt).toLocaleDateString() === selectedDate.toLocaleDateString()
        );
    }, [entries, selectedDate]);

    // --- Handlers for Deletion and Editing ---
    const handleDeleteRequest = (entryId) => { setEntryToDelete(entryId); setIsModalOpen(true); };
    const handleConfirmDelete = () => { if (entryToDelete) dispatch(deleteEntry(entryToDelete)); setIsModalOpen(false); setEntryToDelete(null); };
    const handleStartEdit = (entry) => { setEditingEntryId(entry._id); setEditedText(entry.text); };
    const handleCancelEdit = () => { setEditingEntryId(null); setEditedText(''); };
    const handleSaveEdit = (entryId) => { dispatch(updateEntry({ _id: entryId, text: editedText })); handleCancelEdit(); };

    return (
        <>
            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirm Deletion" message="Are you sure you want to delete this entry? This action cannot be undone." />
            
            {/* 3. New Two-Column Layout */}
            <div className="grid md:grid-cols-3 gap-8">
                
                {/* --- Left Column: Calendar --- */}
                <div className="md:col-span-1">
                    <h2 className="text-3xl font-bold mb-6 text-center">Select a Date</h2>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="mx-auto" // The className prop applies our custom styles
                    />
                </div>

                {/* --- Right Column: Entries --- */}
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Entries for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                    <div className="space-y-4">
                        {isLoading && entries.length === 0 ? <p className="text-center">Loading...</p> :
                            filteredEntries.length > 0 ? (
                                filteredEntries.map((entry) => (
                                    // --- 4. Redesigned Entry Item ---
                                    <div
                                        key={entry._id}
                                        className={`relative border-b-2 border-wood/20 dark:border-dark-gold/20 py-4 transition-opacity ${isDeleting === entry._id ? 'opacity-50' : 'opacity-100'}`}
                                    >
                                        {editingEntryId === entry._id ? (
                                            // EDITING VIEW
                                            <div>
                                                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="w-full h-24 p-2 bg-parchment dark:bg-dark-bg border border-gold dark:border-dark-gold rounded-md focus:outline-none" autoFocus />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleCancelEdit} className="py-1 px-3 rounded text-sm hover:bg-gray-300/50 dark:hover:bg-gray-600/50">Cancel</button>
                                                    <button onClick={() => handleSaveEdit(entry._id)} className="py-1 px-3 rounded text-sm bg-wood dark:bg-dark-gold text-white dark:text-ink hover:opacity-90">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            // DISPLAY VIEW
                                            <>
                                                <EntryActionsMenu onDelete={() => handleDeleteRequest(entry._id)} onEdit={() => handleStartEdit(entry)} />
                                                <p className="text-sm text-ink/60 dark:text-dark-ink/60 mb-2 font-semibold">
                                                    {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="pr-8 whitespace-pre-wrap">{entry.text}</p>
                                                {entry.feeling && (<span className="inline-block bg-gold/30 dark:bg-dark-gold/30 text-ink dark:text-dark-ink font-semibold text-sm mt-2 px-2 py-1 rounded-full">{entry.feeling}</span>)}
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-ink/70 dark:text-dark-ink/70 pt-8">No entries found for this date.</p>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default JournalPage;