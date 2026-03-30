import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { alpha } from '@mui/material/styles';
import { Message, Attack, GuardResult, AttackResult } from '../types';
import ChatWindow from '../components/ChatWindow';
import AttackPanel from '../components/AttackPanel';
import GuardToggle from '../components/GuardToggle';
import GuardOverlay from '../components/GuardOverlay';

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

export default function DemoPage() {
  const [isProtected, setIsProtected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [lastGuardResult, setLastGuardResult] = useState<GuardResult | null>(null);
  const [modeBanner, setModeBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/attacks')
      .then((r) => r.json())
      .then(setAttacks)
      .catch(console.error);
  }, []);

  const handleGuardToggle = (value: boolean) => {
    setIsProtected(value);
    setModeBanner(
      value
        ? '🛡 AI Guard Activated — All attacks will now be blocked'
        : '⚠ AI Guard Disabled — Attacks will succeed',
    );
    setLastGuardResult(null);
    setTimeout(() => setModeBanner(null), 3500);
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMsg: Message = { id: newId(), role: 'user', content: message };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, protected: isProtected }),
        });
        const data = await res.json();

        if (data.guardResult) setLastGuardResult(data.guardResult);

        const botMsg: Message = {
          id: newId(),
          role: 'assistant',
          content: data.response ?? '',
          blocked: data.blocked,
          guardResult: data.guardResult,
          blockedAt: data.blockedAt,
          latencyMs: data.latencyMs,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: 'assistant', content: 'Error: could not reach server.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isProtected],
  );

  const handleAttack = useCallback(
    async (attackId: string) => {
      setIsLoading(true);
      const attack = attacks.find((a) => a.id === attackId);

      const userMsg: Message = {
        id: newId(),
        role: 'user',
        content: attack?.prompt ?? attackId,
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch('/api/attacks/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attackId, protected: isProtected }),
        });
        const data: AttackResult = await res.json();

        if (data.guardResult) setLastGuardResult(data.guardResult);

        const botMsg: Message = {
          id: newId(),
          role: 'assistant',
          content: data.response ?? '',
          blocked: data.blocked,
          guardResult: data.guardResult,
          blockedAt: data.blockedAt,
          latencyMs: data.latencyMs,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [attacks, isProtected],
  );

  return (
    <Box>
      {/* Mode Banner */}
      <Collapse in={Boolean(modeBanner)}>
        <Alert
          severity={isProtected ? 'success' : 'warning'}
          sx={{
            mb: 2,
            fontWeight: 700,
            bgcolor: isProtected ? alpha('#48bb78', 0.15) : alpha('#f6ad55', 0.15),
          }}
        >
          {modeBanner}
        </Alert>
      </Collapse>

      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          VulnBot — HR Assistant
        </Typography>
        <Chip
          label={isProtected ? '🛡 AI GUARD ACTIVE' : '⚠ UNPROTECTED'}
          color={isProtected ? 'success' : 'error'}
          sx={{ fontWeight: 800 }}
        />
      </Box>

      <Grid container spacing={2}>
        {/* Left: Controls */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <GuardToggle isProtected={isProtected} onChange={handleGuardToggle} />
            <AttackPanel attacks={attacks} onAttack={handleAttack} isLoading={isLoading} />
            <GuardOverlay guardResult={lastGuardResult} isProtected={isProtected} />
          </Box>
        </Grid>

        {/* Right: Chat */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid #2d2d2d', bgcolor: 'background.paper', height: '100%' }}
          >
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              isProtected={isProtected}
              onSendMessage={handleSendMessage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
