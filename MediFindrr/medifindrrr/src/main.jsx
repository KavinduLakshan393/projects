import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import your landing page instead of the default App
import MediFindLandingPage from './features/landing/MediFindLandingPage' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MediFindLandingPage />
  </StrictMode>,
)