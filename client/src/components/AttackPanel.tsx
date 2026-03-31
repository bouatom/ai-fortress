import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Attack } from '../types';

const ATTACK_ICONS: Record<string, string> = {
  'prompt-injection': '💉',
  'data-exfiltration': '🔑',
  'jailbreak': '🔓',
  'invisible-injection': '👁',
  'social-engineering': '🎭',
  'harmful-content': '☠',
};

interface AttackPanelProps {
  attacks: Attack[];
  onAttack: (attackId: string) => void;
  isLoading: boolean;
}

export default function AttackPanel({ attacks, onAttack, isLoading }: AttackPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 2, border: '1px solid #222222', bgcolor: 'background.paper' }}
    >
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Attack Library — One-Click OWASP Attacks
      </Typography>

      <Grid container spacing={1}>
        {attacks.map((attack) => (
          <Grid item xs={6} key={attack.id}>
            <Button
              fullWidth
              variant="outlined"
              disabled={isLoading}
              onClick={() => onAttack(attack.id)}
              sx={{
                borderColor: '#222222',
                color: '#888888',
                bgcolor: '#0f0f0f',
                flexDirection: 'column',
                py: 1.5,
                gap: 0.5,
                '&:hover': {
                  borderColor: '#2563eb',
                  color: '#f0f0f0',
                  bgcolor: '#0f0f0f',
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <Box sx={{ fontSize: '1.4rem', lineHeight: 1 }}>
                {ATTACK_ICONS[attack.id] ?? '⚡'}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'inherit' }}>
                {attack.label}
              </Typography>
              <Chip
                label={attack.owaspRisk.replace('OWASP ', '')}
                size="small"
                sx={{
                  bgcolor: '#161b2e',
                  color: '#60a5fa',
                  fontSize: '0.55rem',
                  height: 16,
                }}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
