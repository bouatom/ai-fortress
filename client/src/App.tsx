import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import DemoPage from './pages/DemoPage';
import ScannerPage from './pages/ScannerPage';
import OwaspPage from './pages/OwaspPage';
import ContainerPage from './pages/ContainerPage';
import ConfigPage from './pages/ConfigPage';

const navItems = [
  { label: 'Demo', path: '/' },
  { label: 'AI Scanner', path: '/scanner' },
  { label: 'OWASP Coverage', path: '/owasp' },
  { label: 'Container Security', path: '/container' },
  { label: 'Settings', path: '/settings' },
];

export default function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#111', borderBottom: '1px solid #2d2d2d' }} elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mr: 2 }}>
            🏰 AI Fortress
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
            {navItems.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  size="small"
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 700 : 400,
                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                    borderRadius: 0,
                    px: 1.5,
                    '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Chip
            label="Powered by Trend Vision One"
            size="small"
            variant="outlined"
            sx={{ borderColor: '#e53e3e', color: '#e53e3e', fontSize: '0.65rem' }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: 2 }}>
        <Routes>
          <Route path="/" element={<DemoPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/owasp" element={<OwaspPage />} />
          <Route path="/container" element={<ContainerPage />} />
          <Route path="/settings" element={<ConfigPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
