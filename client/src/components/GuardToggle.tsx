import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

interface GuardToggleProps {
  isProtected: boolean;
  onChange: (value: boolean) => void;
}

export default function GuardToggle({ isProtected, onChange }: GuardToggleProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: isProtected ? 'success.main' : 'error.main',
        bgcolor: isProtected
          ? alpha('#10b981', 0.08)
          : alpha('#ef4444', 0.08),
        transition: 'all 0.4s ease',
        cursor: 'pointer',
      }}
      onClick={() => onChange(!isProtected)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
            Protection Layer
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: isProtected ? 'success.main' : 'error.main',
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            {isProtected ? 'AI Guard Active' : 'AI Guard Off'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isProtected
              ? 'All prompts & responses are scanned'
              : 'No protection — attacks will succeed'}
          </Typography>
        </Box>
        <Switch
          checked={isProtected}
          onChange={(e) => onChange(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          color={isProtected ? 'success' : 'error'}
          sx={{ transform: 'scale(1.3)' }}
        />
      </Box>
    </Paper>
  );
}
