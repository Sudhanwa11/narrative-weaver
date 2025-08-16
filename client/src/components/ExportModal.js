import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ExportModal({ isOpen, onClose }) {
  const { token } = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(1);
  const [range, setRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async (format) => {
    setIsExporting(true);
    setError('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file downloads
      };
      const body = { format, range, customStartDate, customEndDate };
      const response = await axios.post('/api/export', body, config);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileExtension = format === 'docx' ? '.docx' : '.pdf';
      link.setAttribute('download', `MyDiary${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onClose();

    } catch (err) {
      setError('No entries found for this range or an error occurred.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-parchment dark:bg-dark-bg p-6 rounded-lg shadow-xl border border-wood dark:border-dark-gold w-full max-w-lg mx-4">
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Select Export Range</h3>
            <div className="grid grid-cols-2 gap-4">
              {['all', '7days', 'month', 'year', 'custom'].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`p-3 rounded-lg font-semibold ${range === r ? 'bg-wood text-white dark:bg-dark-gold dark:text-ink' : 'bg-white/50 dark:bg-dark-wood/20'}`}>
                  {r === '7days' ? 'Last 7 Days' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            {range === 'custom' && (
              <div className="flex justify-center items-center gap-4 my-4 p-4 bg-white/50 dark:bg-dark-wood/20 rounded-lg">
                <div><label className="block text-sm font-bold mb-1">Start Date</label><DatePicker selected={customStartDate} onChange={setCustomStartDate} className="p-2 rounded w-full dark:bg-dark-bg" /></div>
                <div><label className="block text-sm font-bold mb-1">End Date</label><DatePicker selected={customEndDate} onChange={setCustomEndDate} className="p-2 rounded w-full dark:bg-dark-bg" /></div>
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={onClose} className="py-2 px-4 rounded font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600">Cancel</button>
              <button onClick={() => setStep(2)} className="py-2 px-4 rounded font-semibold bg-gold text-ink">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Select Export Format</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleExport('docx')} disabled={isExporting} className="py-3 px-6 text-lg rounded-lg font-semibold bg-blue-600 text-white">Export as DOCX</button>
              <button onClick={() => handleExport('pdf')} disabled={isExporting} className="py-3 px-6 text-lg rounded-lg font-semibold bg-red-600 text-white">Export as PDF</button>
            </div>
            {isExporting && <p className="text-center mt-4">Generating your file, please wait...</p>}
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setStep(1)} className="py-2 px-4 rounded font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportModal;