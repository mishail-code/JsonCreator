import React from 'react';
import ReactDom from 'react-dom/client';
import JsonCreator from './Components/JsonCreator/JsonCreator.js';

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <JsonCreator />
    </React.StrictMode>
);
