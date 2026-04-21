import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MediFindLandingPage from '@/features/landing/MediFindLandingPage';
import MediFindSearchResultsPage from '@/features/search-results/MediFindSearchResultsPage';
import MediFindInteractionCheckerPage from '@/features/interaction-checker/MediFindInteractionCheckerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MediFindLandingPage />} />
        <Route path="/search" element={<MediFindSearchResultsPage />} />
        <Route path="/interaction-checker" element={<MediFindInteractionCheckerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
