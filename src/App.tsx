import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MeasurementPage from './pages/MeasurementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/measurement/:metricId" element={<MeasurementPage />} />
      </Routes>
    </Router>
  );
}

export default App; 