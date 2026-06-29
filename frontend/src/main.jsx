import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FEFAE0',
                color: '#3E2723',
                border: '1px solid rgba(212, 163, 115, 0.3)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#D4A373', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ff4444', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
