import OpenAI from 'openai';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? 'not-set',
});

async function callOllama(messages: Message[], systemPrompt: string): Promise<string> {
  const ollamaHost = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';

  const allMessages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  const response = await fetch(`${ollamaHost}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { message?: { content?: string }; error?: string };

  if (data.error) {
    throw new Error(`Ollama returned error: ${data.error}`);
  }

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

  if (provider === 'openai') {
    return callOpenAI(messages, systemPrompt);
  }

  return callOllama(messages, systemPrompt);
}
