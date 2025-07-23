import { NextRequest } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

interface HistoryMessage {
  from: 'user' | 'bot';
  text: string;
}

type MessageInput = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function POST(req: NextRequest) {
  const { message, history }: { message: string; history: HistoryMessage[] } = await req.json();

  if (!message) {
    return new Response('Message is required', { status: 400 });
  }

  const conversationHistory: MessageInput[] = history
    .filter((msg): msg is HistoryMessage => msg.from === 'user' || msg.from === 'bot')
    .map((msg) => ({
      role: msg.from === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

  const systemPrompt: MessageInput = {
    role: 'system',
    content: `You are Archie, a professional AI assistant. Provide helpful, accurate, and concise responses to user queries. Follow these guidelines:
1. Maintain a professional yet friendly tone
2. Be concise but thorough in responses
3. Admit when you don't know something
4. Avoid markdown formatting in responses
5. If asked about your capabilities, explain you can answer questions, provide information, and assist with various topics`
  };

  try {
    const stream = await cerebras.chat.completions.create({
      model: 'llama3.1-8b', 
      messages: [
        systemPrompt,
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      max_completion_tokens: 1024,
      temperature: 0.7,
      top_p: 1,
      stream: true
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk?.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
