import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import BoltIcon from '@mui/icons-material/Bolt';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Demo', path: '/', icon: <BoltIcon sx={{ fontSize: 15 }} />, exact: true },
  { label: 'Security Scans', path: '/scans', icon: <SearchIcon sx={{ fontSize: 15 }} />, exact: false },
  { label: 'Coverage', path: '/owasp', icon: <VerifiedUserIcon sx={{ fontSize: 15 }} />, exact: false },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', path: '/settings', icon: <SettingsIcon sx={{ fontSize: 15 }} />, exact: false },
];

function NavItem({
  label,
  path,
  icon,
  exact,
}: {
  label: string;
  path: string;
  icon: React.ReactNode;
  exact: boolean;
}) {
  const location = useLocation();
  const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <RouterLink to={path} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 0.875,
          mx: 1,
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: isActive ? 500 : 400,
          color: isActive ? '#f0f0f0' : '#888888',
          bgcolor: isActive ? '#1a1a1a' : 'transparent',
          borderLeft: isActive ? '2px solid #2563eb' : '2px solid transparent',
          pl: isActive ? '14px' : '16px',
          transition: 'all 0.12s ease',
          '&:hover': {
            bgcolor: '#161616',
            color: '#d0d0d0',
          },
        }}
      >
        {icon}
        <span>{label}</span>
      </Box>
    </RouterLink>
  );
}

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 220,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        bgcolor: '#111111',
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Wordmark */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: '15px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
          }}
        >
          <span style={{ color: '#f0f0f0' }}>Sentinel</span>
          <span style={{ color: '#2563eb' }}>AI</span>
        </Box>
        <Box sx={{ fontSize: '11px', color: '#444444', mt: 0.5 }}>
          AI Security Platform
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1a1a1a', mx: 0 }} />

      {/* Main nav */}
      <Box sx={{ flex: 1, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </Box>

      <Divider sx={{ borderColor: '#1a1a1a' }} />

      {/* Bottom nav */}
      <Box sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
        <Box sx={{ px: 3, pt: 1.5, pb: 1 }}>
          <Box sx={{ fontSize: '10px', color: '#333333', lineHeight: 1.5 }}>
            Powered by
          </Box>
          <Box sx={{ fontSize: '10px', color: '#3a3a3a', fontWeight: 500 }}>
            Trend Vision One
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
