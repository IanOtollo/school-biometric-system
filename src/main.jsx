import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import BiometricAccessSystem from './school-biometric-system';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BiometricAccessSystem />
    <Analytics />
  </React.StrictMode>
);
