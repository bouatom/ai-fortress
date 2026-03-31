import OpenAI from 'openai';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? 'not-set',
});

const OLLAMA_OPTIONS = {
  num_predict: 300, // cap output tokens — keeps demo responses snappy
  num_ctx: 2048,    // smaller context window speeds up CPU inference
  temperature: 0.7,
};

// ── Non-streaming (used for protected path — needs full response for guard check) ──

async function callOllama(messages: Message[], systemPrompt: string): Promise<string> {
  const ollamaHost = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';

  const allMessages: Message[] = [{ role: 'system', content: systemPrompt }, ...messages];

  const response = await fetch(`${ollamaHost}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
      options: OLLAMA_OPTIONS,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { message?: { content?: string }; error?: string };
  if (data.error) throw new Error(`Ollama returned error: ${data.error}`);
  return data.message?.content ?? '';
}

async function callOpenAI(messages: Message[], systemPrompt: string): Promise<string> {
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  return completion.choices[0]?.message?.content ?? '';
}

export async function callLLM(messages: Message[], systemPrompt: string): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? 'ollama';
  return provider === 'openai'
    ? callOpenAI(messages, systemPrompt)
    : callOllama(messages, systemPrompt);
}

// ── Streaming (used for unprotected path — first token in ~1s) ──

async function* streamOllama(
  messages: Message[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const ollamaHost = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';

  const allMessages: Message[] = [{ role: 'system', content: systemPrompt }, ...messages];

  const response = await fetch(`${ollamaHost}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      options: OLLAMA_OPTIONS,
    }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text();
    throw new Error(`Ollama stream error ${response.status}: ${text}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const chunk = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
        if (chunk.message?.content) yield chunk.message.content;
      } catch {
        // ignore malformed chunks
      }
    }
  }
}

async function* streamOpenAI(
  messages: Message[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const stream = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) yield token;
  }
}

export async function* streamLLM(
  messages: Message[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const provider = process.env.LLM_PROVIDER ?? 'ollama';
  if (provider === 'openai') {
    yield* streamOpenAI(messages, systemPrompt);
  } else {
    yield* streamOllama(messages, systemPrompt);
  }
}
