import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

interface ConfigStatus {
  v1ApiKeySet: boolean;
  tmasApiKeySet: boolean;
  v1ApiKeyMasked: string | null;
  tmasApiKeyMasked: string | null;
  v1Region: string;
}

const REGIONS = [
  { value: 'us-1', label: 'US / Americas (us-1)' },
  { value: 'eu-1', label: 'Europe (eu-1)' },
  { value: 'ap-1', label: 'Asia Pacific (ap-1)' },
  { value: 'jp-1', label: 'Japan (jp-1)' },
  { value: 'in-1', label: 'India (in-1)' },
  { value: 'au-1', label: 'Australia (au-1)' },
  { value: 'sg-1', label: 'Singapore (sg-1)' },
];

function StatusChip({ set, masked }: { set: boolean; masked: string | null }) {
  return set ? (
    <Chip label={masked ?? 'Set'} size="small" color="success" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
  ) : (
    <Chip label="Not set" size="small" color="error" variant="outlined" />
  );
}

export default function ConfigPage() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [v1ApiKey, setV1ApiKey] = useState('');
  const [tmasApiKey, setTmasApiKey] = useState('');
  const [v1Region, setV1Region] = useState('us-1');
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: ConfigStatus) => {
        setStatus(data);
        setV1Region(data.v1Region);
      })
      .catch(console.error);
  }, []);

  const handleApply = async () => {
    setApplying(true);
    setResult(null);
    try {
      const body: Record<string, string> = { v1Region };
      if (v1ApiKey.trim()) body.v1ApiKey = v1ApiKey.trim();
      if (tmasApiKey.trim()) body.tmasApiKey = tmasApiKey.trim();

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as ConfigStatus & { ok: boolean };

      setStatus(data);
      setV1ApiKey('');
      setTmasApiKey('');
      setResult({ ok: true, message: 'Configuration applied. AI Guard is now active.' });
    } catch {
      setResult({ ok: false, message: 'Failed to apply configuration. Check server logs.' });
    } finally {
      setApplying(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        ⚙️ Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Set your Vision One API keys. Changes take effect immediately — no restart required.
      </Typography>

      {/* Current status */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #2d2d2d', mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1 }}>
          Current Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Vision One API Key</Typography>
            <StatusChip set={status?.v1ApiKeySet ?? false} masked={status?.v1ApiKeyMasked ?? null} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>TMAS API Key</Typography>
            <StatusChip set={status?.tmasApiKeySet ?? false} masked={status?.tmasApiKeyMasked ?? null} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Region</Typography>
            <Chip label={status?.v1Region ?? '—'} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
          </Box>
        </Box>
      </Paper>

      {/* Edit form */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #2d2d2d' }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: 1 }}>
          Update Keys
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
          <TextField
            label="Vision One API Key"
            type="password"
            value={v1ApiKey}
            onChange={(e) => setV1ApiKey(e.target.value)}
            placeholder="TMV1-xxxxxxxxxxxx"
            size="small"
            fullWidth
            helperText="Leave blank to keep the existing key"
            inputProps={{ autoComplete: 'off' }}
          />

          <TextField
            label="TMAS API Key"
            type="password"
            value={tmasApiKey}
            onChange={(e) => setTmasApiKey(e.target.value)}
            placeholder="Paste your TMAS key"
            size="small"
            fullWidth
            helperText="Leave blank to keep the existing key"
            inputProps={{ autoComplete: 'off' }}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Vision One Region</InputLabel>
            <Select
              value={v1Region}
              label="Vision One Region"
              onChange={(e) => setV1Region(e.target.value)}
            >
              {REGIONS.map((r) => (
                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          {result && (
            <Alert severity={result.ok ? 'success' : 'error'} sx={{ py: 0.5 }}>
              {result.message}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={applying}
            sx={{ fontWeight: 700, alignSelf: 'flex-start', px: 4 }}
          >
            {applying ? 'Applying...' : 'Apply'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
