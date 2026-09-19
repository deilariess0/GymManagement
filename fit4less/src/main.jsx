// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { GymProvider } from './context/GymContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx' // <-- ADD

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GymProvider>
        <NotificationProvider>   {/* <-- ADD */}
          <App />
        </NotificationProvider>  {/* <-- ADD */}
      </GymProvider>
    </BrowserRouter>
  </React.StrictMode>,
)