import { NextResponse } from 'next/server';

// This is a simulated AI response function since we don't want to require actual API keys
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

    // Call HuggingFace Inference API for GPT-2 (no API key required for public models)
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: query }),
      }
    );

    const data = await hfResponse.json();

    let aiText = "Sorry, no response.";
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiText = data[0].generated_text.replace(query, "").trim();
    } else if (data?.generated_text) {
      aiText = data.generated_text.replace(query, "").trim();
    }

    return NextResponse.json({ response: aiText });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request.' },
      { status: 500 }
    );
  }
}
