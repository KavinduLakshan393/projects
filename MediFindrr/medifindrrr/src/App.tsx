import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import MediFindLandingPage from '@/features/landing/MediFindLandingPage'
import MediFindSearchResultsPage from '@/features/search-results/MediFindSearchResultsPage'
import MediFindInteractionCheckerPage from '@/features/interaction-checker/MediFindInteractionCheckerPage'
import MediFindMedicineDetailPage from '@/features/medicine-detail/MediFindMedicineDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MediFindLandingPage />} />
        <Route path="/search" element={<MediFindSearchResultsPage />} />
        <Route path="/interaction-checker" element={<MediFindInteractionCheckerPage />} />
        <Route path="/medicine/:slug" element={<MediFindMedicineDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}