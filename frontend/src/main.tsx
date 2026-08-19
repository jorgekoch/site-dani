import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './hero-overrides.css'
import './site-redesign.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
