import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';

console.log('🚀 Starting Qssun Reports App...');
console.log('📍 Environment:', import.meta.env.MODE);
console.log('🔧 Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');
console.log('🎯 Root element found:', !!rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);

console.log('⚛️ Rendering React app...');

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

console.log('✅ React app rendered successfully!');