import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import DemoPage from './pages/DemoPage';
import SecurityScansPage from './pages/SecurityScansPage';
import OwaspPage from './pages/OwaspPage';
import ConfigPage from './pages/ConfigPage';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, ml: '220px', p: 3, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<DemoPage />} />
          <Route path="/scans" element={<SecurityScansPage />} />
          <Route path="/owasp" element={<OwaspPage />} />
          <Route path="/settings" element={<ConfigPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
