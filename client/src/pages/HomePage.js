// client/src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-4xl font-bold mb-4">Welcome to The Narrative Weaver</h2>
      <p className="text-lg text-ink/80 dark:text-dark-ink/80 mb-8">
        Your personal space for reflection and growth.
      </p>
      <div>
        <Link 
          to="/register" 
          className="bg-wood dark:bg-dark-gold text-white dark:text-ink font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HomePage;