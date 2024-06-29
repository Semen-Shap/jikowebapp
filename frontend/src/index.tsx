import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter} from 'react-router-dom';
import './shared/styles/global.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
//import debug from './shared/api/debug/debug';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
//debug();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)


reportWebVitals();
