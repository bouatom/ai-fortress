import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

interface TmasScanResult {
  image: string;
  scanDate: string;
  vulnerabilities: { critical: number; high: number; medium: number; low: number };
  secrets: { count: number; details: string[] };
  malware: string;
  sbom: string;
  verdict: string;
  verdictColor: 'error' | 'warning' | 'success';
}

const MOCK_RESULT: TmasScanResult = {
  image: 'ai-fortress:latest',
  scanDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  vulnerabilities: { critical: 0, high: 3, medium: 8, low: 22 },
  secrets: {
    count: 2,
    details: [
      'Hardcoded API key in environment layer (layer 4)',
      'Database password in /app/config/default.json',
    ],
  },
  malware: 'Clean — no malware detected',
  sbom: 'Generated — 142 packages catalogued',
  verdict: '⚠ CONDITIONAL — Secrets detected. Remediate before production deployment.',
  verdictColor: 'warning',
};

const SCAN_STEPS = [
  'Pulling image layers...',
  'Scanning OS packages for CVEs...',
  'Checking for malware signatures...',
  'Detecting hardcoded secrets...',
  'Generating SBOM...',
  'Evaluating admission policy...',
];

const SEV_COLORS: Record<string, string> = {
  critical: '#fc8181',
  high: '#f6ad55',
  medium: '#f6e05e',
  low: '#68d391',
};

export default function ContainerPage() {
  const [result, setResult] = useState<TmasScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const runScan = async () => {
    setIsScanning(true);
    setResult(null);
    setScanStep(0);
    setProgress(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setScanStep(i);
      setProgress(((i + 1) / SCAN_STEPS.length) * 100);
    }

    await new Promise((r) => setTimeout(r, 300));
    setResult(MOCK_RESULT);
    setIsScanning(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🐳 Container Security — TMAS Scan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Trend Micro Artifact Scanner (TMAS) scans the VulnBot container for CVEs, secrets, and malware.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={runScan}
          disabled={isScanning}
          sx={{ fontWeight: 700, px: 3, minWidth: 160 }}
        >
          {isScanning ? 'Scanning...' : 'Run TMAS Scan'}
        </Button>
      </Box>

      {isScanning && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #2d2d2d', mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1.5 }}>
            🔬 {SCAN_STEPS[scanStep]}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>
      )}

      {result && (
        <Box>
          {/* Verdict */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              border: '1px solid',
              borderColor: `${result.verdictColor}.main`,
              bgcolor: alpha(result.verdictColor === 'warning' ? '#f6ad55' : '#48bb78', 0.08),
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
              Admission Verdict — {result.image}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, color: `${result.verdictColor}.main` }}>
              {result.verdict}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Scanned: {result.scanDate}
            </Typography>
          </Paper>

          <Grid container spacing={2}>
            {/* Vulnerabilities */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #2d2d2d', height: '100%' }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                  Vulnerabilities (CVEs)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  {Object.entries(result.vulnerabilities).map(([sev, count]) => (
                    <Box key={sev} sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: SEV_COLORS[sev] }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                        {sev}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" sx={{ color: 'success.main', mt: 1.5, display: 'block' }}>
                  ✓ No critical vulnerabilities. High severity items are OS package upgrades available.
                </Typography>
              </Paper>
            </Grid>

            {/* Secrets */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #f6ad55', bgcolor: alpha('#f6ad55', 0.05), height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: 'warning.main', fontSize: '0.6rem' }}>
                    Secrets Detected — {result.secrets.count} found
                  </Typography>
                </Box>
                {result.secrets.details.map((detail, i) => (
                  <Typography key={i} variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    • {detail}
                  </Typography>
                ))}
              </Paper>
            </Grid>

            {/* Malware */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #48bb78', bgcolor: alpha('#48bb78', 0.05) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: 'success.main', fontSize: '0.6rem' }}>
                    Malware Scan
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5, color: 'success.light' }}>
                  {result.malware}
                </Typography>
              </Paper>
            </Grid>

            {/* SBOM */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #2d2d2d' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                    SBOM
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {result.sbom}
                </Typography>
                <Chip
                  label="CycloneDX Format"
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1, fontSize: '0.6rem', height: 18 }}
                />
              </Paper>
            </Grid>

            {/* CI/CD Block */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{ p: 2, border: '1px solid #e53e3e', bgcolor: alpha('#e53e3e', 0.05) }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorIcon sx={{ color: 'error.main', fontSize: 18 }} />
                  <Typography variant="overline" sx={{ color: 'error.main', fontSize: '0.6rem' }}>
                    CI/CD Admission Control
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  This image would be <strong style={{ color: '#fc8181' }}>BLOCKED</strong> from production deployment by TMAS admission control.
                  Fix the 2 detected secrets before this image can proceed to production.
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label="Integrate with GitHub Actions" size="small" variant="outlined" sx={{ mr: 1, fontSize: '0.6rem' }} />
                  <Chip label="Kubernetes Admission Webhook" size="small" variant="outlined" sx={{ fontSize: '0.6rem' }} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
