import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { OnboardingProvider } from './contexts/OnboardingContext'
import Welcome from './screens/onboarding/Welcome'
import BusinessSetup from './screens/onboarding/BusinessSetup'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/app" element={<App />} />
        <Route
          path="/setup"
          element={
            <OnboardingProvider>
              <BusinessSetup />
            </OnboardingProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
