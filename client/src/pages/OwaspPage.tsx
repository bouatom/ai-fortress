import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OwaspScorecard from '../components/OwaspScorecard';

export default function OwaspPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          OWASP Top 10 for LLMs
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          OWASP Top 10 for Large Language Models 2025 — how Vision One covers each risk.
        </Typography>
      </Box>
      <OwaspScorecard />
    </Box>
  );
}
