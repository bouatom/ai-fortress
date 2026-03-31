import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { ScanReport as ScanReportType } from '../types';
import ScanReport from '../components/ScanReport';

// ── AI Scanner ────────────────────────────────────────────────────────────────

const AI_SCAN_STEPS = [
  'Connecting to model endpoint...',
  'Injecting probe prompts...',
  'Testing for prompt injection...',
  'Attempting system prompt extraction...',
  'Testing data exfiltration vectors...',
  'Checking for jailbreak susceptibility...',
  'Analyzing response patterns...',
  'Generating vulnerability report...',
];

// ── Container Security ────────────────────────────────────────────────────────

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

const CONTAINER_SCAN_STEPS = [
  'Pulling image layers...',
  'Scanning OS packages for CVEs...',
  'Checking for malware signatures...',
  'Detecting hardcoded secrets...',
  'Generating SBOM...',
  'Evaluating admission policy...',
];

const MOCK_RESULT: TmasScanResult = {
  image: 'novatech-hrbot:latest',
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
  verdict: 'CONDITIONAL — Secrets detected. Remediate before production deployment.',
  verdictColor: 'warning',
};

const SEV_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#fbbf24',
  low: '#10b981',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SecurityScansPage() {
  // AI Scanner state
  const [scanReport, setScanReport] = useState<ScanReportType | null>(null);
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [scannerStep, setScannerStep] = useState(0);
  const [scannerProgress, setScannerProgress] = useState(0);

  // Container state
  const [containerResult, setContainerResult] = useState<TmasScanResult | null>(null);
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  const [containerStep, setContainerStep] = useState(0);
  const [containerProgress, setContainerProgress] = useState(0);

  const runAiScan = async () => {
    setIsScannerRunning(true);
    setScanReport(null);
    setScannerStep(0);
    setScannerProgress(0);

    for (let i = 0; i < AI_SCAN_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setScannerStep(i);
      setScannerProgress(((i + 1) / AI_SCAN_STEPS.length) * 100);
    }

    try {
      const res = await fetch('/api/scanner/run?model=vulnbot');
      const data: ScanReportType = await res.json();
      setScanReport(data);
    } catch (err) {
      console.error('AI scan failed:', err);
    } finally {
      setIsScannerRunning(false);
    }
  };

  const runContainerScan = async () => {
    setIsContainerRunning(true);
    setContainerResult(null);
    setContainerStep(0);
    setContainerProgress(0);

    for (let i = 0; i < CONTAINER_SCAN_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setContainerStep(i);
      setContainerProgress(((i + 1) / CONTAINER_SCAN_STEPS.length) * 100);
    }

    await new Promise((r) => setTimeout(r, 300));
    setContainerResult(MOCK_RESULT);
    setIsContainerRunning(false);
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Security Scans
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          AI vulnerability scanning and container security analysis for VulnBot.
        </Typography>
      </Box>

      {/* ── AI Scanner section ─────────────────────────────────────────────── */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
              AI Scanner
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Pre-deployment red-team scan — OWASP Top 10 LLM
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={runAiScan}
            disabled={isScannerRunning}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {isScannerRunning ? 'Scanning...' : 'Scan VulnBot'}
          </Button>
        </Box>

        {isScannerRunning && (
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #222222', mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, mb: 1.5 }}>
              {AI_SCAN_STEPS[scannerStep]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={scannerProgress}
              sx={{
                height: 3,
                bgcolor: '#1a1a1a',
                '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {Math.round(scannerProgress)}% complete
            </Typography>
          </Paper>
        )}

        <ScanReport report={scanReport} isLoading={false} />

        {!isScannerRunning && !scanReport && (
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #1e1e1e', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Run a scan to find vulnerabilities in VulnBot before deployment.
            </Typography>
          </Paper>
        )}
      </Box>

      <Divider sx={{ borderColor: '#1a1a1a', my: 4 }} />

      {/* ── Container Security section ─────────────────────────────────────── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
              Container Security
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              TMAS image scan — CVEs, secrets, malware, SBOM
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={runContainerScan}
            disabled={isContainerRunning}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {isContainerRunning ? 'Scanning...' : 'Run TMAS Scan'}
          </Button>
        </Box>

        {isContainerRunning && (
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #222222', mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, mb: 1.5 }}>
              {CONTAINER_SCAN_STEPS[containerStep]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={containerProgress}
              sx={{
                height: 3,
                bgcolor: '#1a1a1a',
                '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {Math.round(containerProgress)}% complete
            </Typography>
          </Paper>
        )}

        {containerResult && (
          <Box>
            {/* Verdict */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2.5,
                border: '1px solid',
                borderColor: `${containerResult.verdictColor}.main`,
                bgcolor: alpha(containerResult.verdictColor === 'warning' ? '#f59e0b' : '#10b981', 0.06),
              }}
            >
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Admission Verdict — {containerResult.image}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 0.5, color: `${containerResult.verdictColor}.main` }}
              >
                {containerResult.verdict}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Scanned: {containerResult.scanDate}
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              {/* Vulnerabilities */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid #222222', height: '100%' }}>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    Vulnerabilities (CVEs)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2.5, mt: 1.5, flexWrap: 'wrap' }}>
                    {Object.entries(containerResult.vulnerabilities).map(([sev, count]) => (
                      <Box key={sev} sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: SEV_COLORS[sev] }}>
                          {count}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                        >
                          {sev}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'success.main', mt: 2, display: 'block' }}>
                    No critical vulnerabilities. High severity items are available OS package upgrades.
                  </Typography>
                </Paper>
              </Grid>

              {/* Secrets */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'warning.main',
                    bgcolor: alpha('#f59e0b', 0.05),
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                    <Typography variant="overline" sx={{ color: 'warning.main' }}>
                      Secrets Detected — {containerResult.secrets.count} found
                    </Typography>
                  </Box>
                  {containerResult.secrets.details.map((detail, i) => (
                    <Typography key={i} variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      · {detail}
                    </Typography>
                  ))}
                </Paper>
              </Grid>

              {/* Malware */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, border: '1px solid', borderColor: 'success.main', bgcolor: alpha('#10b981', 0.05) }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    <Typography variant="overline" sx={{ color: 'success.main' }}>
                      Malware Scan
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'success.light' }}>
                    {containerResult.malware}
                  </Typography>
                </Paper>
              </Grid>

              {/* SBOM */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid #222222' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                      SBOM
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {containerResult.sbom}
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
                  sx={{ p: 2, border: '1px solid', borderColor: 'error.main', bgcolor: alpha('#ef4444', 0.05) }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />
                    <Typography variant="overline" sx={{ color: 'error.main' }}>
                      CI/CD Admission Control
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    This image would be{' '}
                    <strong style={{ color: '#ef4444' }}>BLOCKED</strong> from production deployment by
                    TMAS admission control. Remediate the 2 detected secrets before this image can proceed.
                  </Typography>
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="GitHub Actions" size="small" variant="outlined" sx={{ fontSize: '0.6rem' }} />
                    <Chip label="Kubernetes Admission Webhook" size="small" variant="outlined" sx={{ fontSize: '0.6rem' }} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {!isContainerRunning && !containerResult && (
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #1e1e1e', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Scan the VulnBot container image for CVEs, secrets, and malware using TMAS.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
