import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// --- Component & Page Imports ---
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DiaryPage from './pages/DiaryPage';
import JournalPage from './pages/JournalPage';
import SummaryPage from './pages/SummaryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement; 
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]); 


  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Private Routes (assuming logic to protect them is in each component) */}
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/summaries" element={<SummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;