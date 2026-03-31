import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import { GuardResult } from '../types';

interface GuardOverlayProps {
  guardResult: GuardResult | null;
  isProtected: boolean;
}

export default function GuardOverlay({ guardResult, isProtected }: GuardOverlayProps) {
  if (!isProtected) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: '1px solid #222222', bgcolor: '#111' }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          AI Guard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Disabled — toggle AI Guard to see real-time threat analysis
        </Typography>
      </Paper>
    );
  }

  if (!guardResult) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: '1px solid #1a3a2a', bgcolor: alpha('#10b981', 0.05) }}
      >
        <Typography variant="overline" sx={{ color: 'success.main', fontSize: '0.6rem' }}>
          AI Guard Active
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Monitoring all prompts and responses. Send a message to see guard decisions.
        </Typography>
      </Paper>
    );
  }

  const isBlocked = guardResult.action === 'block';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: isBlocked ? 'error.main' : 'success.main',
        bgcolor: isBlocked ? alpha('#ef4444', 0.08) : alpha('#10b981', 0.08),
        transition: 'all 0.3s ease',
      }}
    >
      <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
        AI Guard Decision
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: isBlocked ? 'error.main' : 'success.main',
          mt: 0.5,
          fontSize: '0.95rem',
        }}
      >
        {isBlocked ? 'BLOCKED' : 'ALLOWED'}
      </Typography>

      {guardResult.riskScore > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Risk Score
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: isBlocked ? 'error.main' : 'success.main' }}
            >
              {guardResult.riskScore.toFixed(1)}/10
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={guardResult.riskScore * 10}
            color={isBlocked ? 'error' : 'success'}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      {guardResult.reasons.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {guardResult.reasons.map((reason, i) => (
            <Chip
              key={i}
              label={reason}
              size="small"
              color={isBlocked ? 'error' : 'success'}
              variant="outlined"
              sx={{ fontSize: '0.6rem', height: 20 }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
