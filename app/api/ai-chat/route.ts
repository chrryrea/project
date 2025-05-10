import { NextResponse } from 'next/server';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    // Check if we have a valid query
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a valid question.' },
        { status: 400 }
      );
    }

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error('Groq API error response:', errorBody);
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const data = await groqResponse.json();
    console.log('Groq API status:', groqResponse.status);
    console.log('Groq API response:', JSON.stringify(data));
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq API');
    }

    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request.' },
      { status: 500 }
    );
  }
}
