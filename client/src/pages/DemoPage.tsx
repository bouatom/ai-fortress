import { useState, useEffect, useCallback, useRef } from 'react';
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

// Read an SSE stream, appending tokens into a message by ID.
// Returns the final event payload ({ done, blocked, latencyMs }).
async function readSseStream(
  response: Response,
  onToken: (token: string) => void,
): Promise<void> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const event = JSON.parse(line.slice(6)) as { token?: string };
        if (event.token) onToken(event.token);
      } catch {
        // ignore malformed chunks
      }
    }
  }
}

export default function DemoPage() {
  const [isProtected, setIsProtected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [lastGuardResult, setLastGuardResult] = useState<GuardResult | null>(null);
  const [modeBanner, setModeBanner] = useState<string | null>(null);
  const streamingBotIdRef = useRef<string | null>(null);

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
        ? 'AI Guard Activated — All attacks will now be blocked'
        : 'AI Guard Disabled — Attacks will succeed',
    );
    setLastGuardResult(null);
    setTimeout(() => setModeBanner(null), 3500);
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMsg: Message = { id: newId(), role: 'user', content: message };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      if (!isProtected) {
        // Unprotected — stream tokens directly for instant feedback
        const botId = newId();
        streamingBotIdRef.current = botId;
        setMessages((prev) => [...prev, { id: botId, role: 'assistant', content: '' }]);
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, protected: false }),
          });
          await readSseStream(res, (token) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === botId ? { ...m, content: m.content + token } : m)),
            );
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, content: 'Error: could not reach server.' } : m,
            ),
          );
        } finally {
          streamingBotIdRef.current = null;
          setIsLoading(false);
        }
        return;
      }

      // Protected — wait for full JSON response (guard needs the complete LLM output)
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

      if (!isProtected) {
        // Unprotected — stream the attack response
        const botId = newId();
        streamingBotIdRef.current = botId;
        setMessages((prev) => [...prev, { id: botId, role: 'assistant', content: '' }]);
        try {
          const res = await fetch('/api/attacks/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attackId, protected: false }),
          });
          await readSseStream(res, (token) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === botId ? { ...m, content: m.content + token } : m)),
            );
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, content: 'Error: could not reach server.' } : m,
            ),
          );
        } finally {
          streamingBotIdRef.current = null;
          setIsLoading(false);
        }
        return;
      }

      // Protected — wait for full JSON
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
            bgcolor: isProtected ? alpha('#10b981', 0.15) : alpha('#f59e0b', 0.15),
          }}
        >
          {modeBanner}
        </Alert>
      </Collapse>

      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            VulnBot
          </Typography>
          <Chip
            label={isProtected ? 'AI Guard Active' : 'Unprotected'}
            color={isProtected ? 'success' : 'error'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          NovaTech Corp HR Assistant · Powered by Sentinel AI
        </Typography>
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
            sx={{ border: '1px solid #222222', bgcolor: 'background.paper', height: '100%' }}
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
