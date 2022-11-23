import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './index.scss'

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = ReactDOM.createRoot(document.getElementById("root"));

rootElement.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>);
serviceWorkerRegistration.unregister();

reportWebVitals();
