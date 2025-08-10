import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal Panel */}
      <div className="bg-parchment dark:bg-dark-bg p-6 rounded-lg shadow-xl border border-wood dark:border-dark-gold w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-ink dark:text-dark-ink mb-6">{message}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;