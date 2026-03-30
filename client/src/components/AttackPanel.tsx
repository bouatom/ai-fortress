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
      sx={{ p: 2, border: '1px solid #2d2d2d', bgcolor: 'background.paper' }}
    >
      <Typography variant="overline" sx={{ color: 'error.main', fontSize: '0.6rem', display: 'block', mb: 1 }}>
        ⚔ Attack Library — One-Click OWASP Attacks
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
                borderColor: '#4a1a1a',
                color: '#fc8181',
                bgcolor: '#1a0a0a',
                flexDirection: 'column',
                py: 1.5,
                gap: 0.5,
                '&:hover': {
                  borderColor: 'error.main',
                  bgcolor: '#2d1010',
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
                  bgcolor: '#3d1515',
                  color: '#fc8181',
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
