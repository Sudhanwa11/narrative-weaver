import React, { useState, useEffect, useRef } from 'react';

function EntryActionsMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // This effect handles clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  return (
    <div className="absolute top-2 right-2" ref={menuRef}>
      <button
        // This is the updated onClick handler
        onClick={(e) => {
          e.stopPropagation(); // This line prevents the double-click issue
          setIsOpen(!isOpen);
        }}
        className="text-ink/60 dark:text-dark-ink/60 hover:text-ink dark:hover:text-dark-ink font-bold p-1 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-parchment dark:bg-dark-bg border border-wood dark:border-dark-gold z-10">
          <div className="py-1" role="menu">
            <button
              onClick={handleEdit}
              className="w-full text-left block px-4 py-2 text-sm text-ink dark:text-dark-ink hover:bg-gold/20 dark:hover:bg-dark-gold/20"
              role="menuitem"
            >
              Edit Entry
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left block px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-gold/20 dark:hover:bg-dark-gold/20"
              role="menuitem"
            >
              Delete Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntryActionsMenu;