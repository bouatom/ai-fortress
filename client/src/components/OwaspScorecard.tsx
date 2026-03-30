import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningIcon from '@mui/icons-material/Warning';
import { alpha } from '@mui/material/styles';

interface OwaspRisk {
  id: string;
  name: string;
  status: 'protected' | 'partial';
  coverage: string;
  component: string;
}

const OWASP_RISKS: OwaspRisk[] = [
  {
    id: 'LLM01',
    name: 'Prompt Injection',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard',
  },
  {
    id: 'LLM02',
    name: 'Sensitive Info Disclosure',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard + AI Scanner',
  },
  {
    id: 'LLM03',
    name: 'Supply Chain',
    status: 'protected',
    coverage: 'Full',
    component: 'TMAS',
  },
  {
    id: 'LLM04',
    name: 'Data & Model Poisoning',
    status: 'partial',
    coverage: 'Partial',
    component: 'AI Scanner',
  },
  {
    id: 'LLM05',
    name: 'Improper Output Handling',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard',
  },
  {
    id: 'LLM06',
    name: 'Excessive Agency',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard',
  },
  {
    id: 'LLM07',
    name: 'System Prompt Leakage',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard + AI Scanner',
  },
  {
    id: 'LLM08',
    name: 'Vector & Embedding Weaknesses',
    status: 'partial',
    coverage: 'Partial',
    component: 'AI Scanner',
  },
  {
    id: 'LLM09',
    name: 'Misinformation / Hallucinations',
    status: 'protected',
    coverage: 'Full',
    component: 'AI Guard',
  },
  {
    id: 'LLM10',
    name: 'Unbounded Consumption',
    status: 'partial',
    coverage: 'Partial',
    component: 'TMAS + Rate Limiting',
  },
];

export default function OwaspScorecard() {
  const protectedCount = OWASP_RISKS.filter((r) => r.status === 'protected').length;

  return (
    <Box>
      {/* Coverage ring */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, textAlign: 'center', border: '1px solid #2d2d2d', bgcolor: '#111' }}
      >
        <Typography
          variant="h1"
          sx={{ fontWeight: 900, color: 'success.main', fontSize: '5rem', lineHeight: 1 }}
        >
          {protectedCount}/10
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
          OWASP Top 10 LLM Risks Covered by Vision One
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip
            icon={<ShieldIcon />}
            label={`${protectedCount} Fully Protected`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<WarningIcon />}
            label={`${10 - protectedCount} Partial Coverage`}
            color="warning"
            variant="outlined"
          />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {OWASP_RISKS.map((risk) => {
          const isProtected = risk.status === 'protected';
          return (
            <Grid item xs={12} sm={6} key={risk.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: isProtected ? 'success.main' : 'warning.main',
                  bgcolor: isProtected ? alpha('#48bb78', 0.07) : alpha('#f6ad55', 0.07),
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {isProtected ? (
                    <ShieldIcon sx={{ color: 'success.main', fontSize: 18 }} />
                  ) : (
                    <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                  )}
                  <Chip
                    label={risk.id}
                    size="small"
                    sx={{
                      bgcolor: isProtected ? 'success.main' : 'warning.main',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      height: 20,
                    }}
                  />
                  <Chip
                    label={risk.coverage}
                    size="small"
                    variant="outlined"
                    color={isProtected ? 'success' : 'warning'}
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {risk.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {risk.component}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
