import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import { ScanReport as ScanReportType } from '../types';
import ScanReport from '../components/ScanReport';

const SCAN_STEPS = [
  'Connecting to model endpoint...',
  'Injecting probe prompts...',
  'Testing for prompt injection...',
  'Attempting system prompt extraction...',
  'Testing data exfiltration vectors...',
  'Checking for jailbreak susceptibility...',
  'Analyzing response patterns...',
  'Generating vulnerability report...',
];

export default function ScannerPage() {
  const [report, setReport] = useState<ScanReportType | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const runScan = async () => {
    setIsScanning(true);
    setReport(null);
    setScanStep(0);
    setProgress(0);

    // Animate the scan steps
    const stepDuration = 400;
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, stepDuration));
      setScanStep(i);
      setProgress(((i + 1) / SCAN_STEPS.length) * 100);
    }

    try {
      const res = await fetch('/api/scanner/run?model=vulnbot');
      const data: ScanReportType = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            🔍 AI Scanner — Pre-Deployment Security Scan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Red-team VulnBot before it goes live. Finds vulnerabilities mapped to OWASP Top 10 LLM risks.
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
          {isScanning ? 'Scanning...' : 'Scan VulnBot'}
        </Button>
      </Box>

      {isScanning && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #2d2d2d', mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1.5 }}>
            🔬 {SCAN_STEPS[scanStep]}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="primary"
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
            {Math.round(progress)}% complete
          </Typography>
        </Paper>
      )}

      <ScanReport report={report} isLoading={false} />
    </Box>
  );
}
