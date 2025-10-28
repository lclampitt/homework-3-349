// src/main.jsx

// Import React core library
import React from 'react';

// Import ReactDOM for rendering React components to the DOM
import ReactDOM from 'react-dom/client';

// Import the main App component
import App from './App.jsx';

// Import global stylesheet
import './styles.css'; // main styling for entire app

// Create the root React DOM node and render the App component
ReactDOM.createRoot(document.getElementById('root')).render(
  // Enables extra checks and warnings during development
  <React.StrictMode>
    {/* Main application component */}
    <App />
  </React.StrictMode>
);
