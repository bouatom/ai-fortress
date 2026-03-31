import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import { ScanReport as ScanReportType, ScanFinding } from '../types';

const SEVERITY_COLOR = {
  critical: { bg: alpha('#ef4444', 0.1), border: '#ef4444', text: '#ef4444' },
  high: { bg: alpha('#f59e0b', 0.1), border: '#f59e0b', text: '#f59e0b' },
  medium: { bg: alpha('#fbbf24', 0.08), border: '#fbbf24', text: '#fbbf24' },
  low: { bg: alpha('#10b981', 0.08), border: '#10b981', text: '#10b981' },
};

function FindingCard({ finding }: { finding: ScanFinding }) {
  const [expanded, setExpanded] = useState(false);
  const colors = SEVERITY_COLOR[finding.severity];

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, border: '1px solid', borderColor: colors.border, bgcolor: colors.bg, mb: 1.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={finding.severity.toUpperCase()}
              size="small"
              sx={{ bgcolor: colors.border, color: '#000', fontSize: '0.6rem', fontWeight: 800, height: 18 }}
            />
            <Chip
              label={finding.owaspId}
              size="small"
              variant="outlined"
              sx={{ borderColor: colors.border, color: colors.text, fontSize: '0.6rem', height: 18 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {finding.owaspCategory}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, color: colors.text }}>
            {finding.title}
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Risk Score
            </Typography>
            <LinearProgress
              variant="determinate"
              value={finding.riskScore * 10}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: '#1a1a1a',
                '& .MuiLinearProgress-bar': { bgcolor: colors.border },
              }}
            />
            <Typography variant="caption" sx={{ color: colors.text, fontWeight: 700, minWidth: 28 }}>
              {finding.riskScore.toFixed(1)}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #1a1a1a' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {finding.description}
          </Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
            ✓ Remediation:
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            {finding.remediation}
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
}

interface ScanReportProps {
  report: ScanReportType | null;
  isLoading: boolean;
}

export default function ScanReport({ report, isLoading }: ScanReportProps) {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress color="primary" size={40} />
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
          Scanning VulnBot for vulnerabilities...
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
          Simulating prompt injection, jailbreak, data exfiltration attacks...
        </Typography>
      </Box>
    );
  }

  if (!report) return null;

  const counts = {
    critical: report.findings.filter((f) => f.severity === 'critical').length,
    high: report.findings.filter((f) => f.severity === 'high').length,
    medium: report.findings.filter((f) => f.severity === 'medium').length,
    low: report.findings.filter((f) => f.severity === 'low').length,
  };

  return (
    <Box>
      {/* Summary */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'error.main', bgcolor: alpha('#ef4444', 0.08), mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'error.main', fontSize: '0.6rem' }}>
          Scan Summary — {report.modelName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
          {Object.entries(counts).map(([sev, count]) => (
            <Box key={sev} sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: SEVERITY_COLOR[sev as keyof typeof SEVERITY_COLOR].text }}
              >
                {count}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                {sev}
              </Typography>
            </Box>
          ))}
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Overall Risk
            </Typography>
            <Chip
              label={report.overallRisk.toUpperCase()}
              sx={{
                bgcolor: SEVERITY_COLOR[report.overallRisk].border,
                color: '#000',
                fontWeight: 800,
              }}
            />
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
          {report.summary}
        </Typography>
      </Paper>

      {/* Findings */}
      {report.findings.map((finding) => (
        <FindingCard key={finding.id} finding={finding} />
      ))}
    </Box>
  );
}
