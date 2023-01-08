import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './components/Game';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game width="9" height="9" bombs="10" />);

