import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import ShieldIcon from '@mui/icons-material/Shield';
import { alpha } from '@mui/material/styles';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isProtected: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  isProtected,
  onSendMessage,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    onSendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Bot header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: '1px solid #222222',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          HRBot · NovaTech Corp
        </Typography>
        {isProtected && (
          <ShieldIcon sx={{ fontSize: 14, color: 'success.main' }} />
        )}
        <Chip
          label={isProtected ? 'Protected' : 'Unprotected'}
          size="small"
          color={isProtected ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontSize: '0.6rem', height: 18, ml: 'auto' }}
        />
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          minHeight: 300,
          maxHeight: 400,
        }}
      >
        {messages.length === 0 && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}
          >
            Ask HRBot a question, or click an attack button to begin the demo.
          </Typography>
        )}

        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: '80%',
                bgcolor: msg.blocked
                  ? alpha('#ef4444', 0.1)
                  : msg.role === 'user'
                  ? alpha('#2563eb', 0.15)
                  : '#1a1a1a',
                border: '1px solid',
                borderColor: msg.blocked
                  ? 'error.main'
                  : msg.role === 'user'
                  ? alpha('#2563eb', 0.3)
                  : '#222222',
              }}
            >
              {msg.blocked && (
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label="BLOCKED BY AI GUARD"
                    size="small"
                    color="error"
                    sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700 }}
                  />
                  {msg.blockedAt && (
                    <Typography variant="caption" sx={{ color: 'error.light' }}>
                      (at {msg.blockedAt} layer)
                    </Typography>
                  )}
                </Box>
              )}

              {msg.blocked && msg.guardResult?.reasons && msg.guardResult.reasons.length > 0 && (
                <Typography variant="caption" sx={{ color: 'error.light', display: 'block', mb: 1 }}>
                  {msg.guardResult.reasons[0]}
                </Typography>
              )}

              {!msg.blocked && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {msg.content}
                </Typography>
              )}

              {msg.latencyMs !== undefined && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5, textAlign: 'right' }}
                >
                  {msg.latencyMs}ms
                </Typography>
              )}
            </Paper>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Paper
              elevation={0}
              sx={{ p: 1.5, bgcolor: '#1a1a1a', border: '1px solid #222222' }}
            >
              <CircularProgress size={16} />
            </Paper>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 1.5, borderTop: '1px solid #222222', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Message HRBot..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#111',
              fontSize: '0.85rem',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
