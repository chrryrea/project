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

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate response based on the query
    const response = generateResponse(query);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request.' },
      { status: 500 }
    );
  }
}

function generateResponse(query: string): string {
  // Dictionary of predefined responses for common queries
  const responses: Record<string, string> = {
    "hello": "Hello! I'm your AI study assistant. How can I help with your coursework today?",
    "hi": "Hi there! I'm your AI study assistant. How can I help with your coursework today?",
    "who are you": "I'm your AI study assistant, designed to help college students with their academic questions and research.",
    "how does ai work": "AI systems like me work through pattern recognition in large datasets. We use machine learning algorithms to recognize patterns and make predictions. Neural networks, which are loosely based on how human brains work, help us process and 'understand' text, images, and other types of data. For college-level AI study, I'd recommend looking into courses on machine learning fundamentals and neural network architectures.",
    "what is machine learning": "Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It involves algorithms that can analyze data, identify patterns, and make decisions with minimal human intervention. Key types include supervised learning (trained on labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). This is a fundamental concept in your computer science curriculum!",
    "python programming": "Python is an excellent language for AI development due to its simplicity and powerful libraries like TensorFlow, PyTorch, and scikit-learn. For college projects, I'd recommend starting with Python basics and then exploring these libraries for machine learning applications.",
    "javascript": "JavaScript is primarily used for web development, but it's increasingly being used for AI through libraries like TensorFlow.js. It allows you to deploy machine learning models directly in the browser, which can be great for interactive college projects that demonstrate AI concepts.",
    "data structures": "Data structures are fundamental to computer science. The main ones to master are arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each has specific use cases and efficiency characteristics. For college courses, understanding their time and space complexity is crucial for algorithm analysis.",
    "algorithms": "Algorithms are step-by-step procedures for solving problems. Important categories include sorting algorithms (quicksort, mergesort), search algorithms (binary search), graph algorithms (Dijkstra's, A*), and dynamic programming. These are essential knowledge for computer science coursework and technical interviews.",
    "neural networks": "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes or 'neurons' that process information. Deep learning uses neural networks with many layers (hence 'deep'). For college-level understanding, focus on feedforward networks, convolutional networks (CNNs), and recurrent networks (RNNs).",
    "help": "I can help with various academic topics including programming concepts, mathematics, computer science theory, research assistance, and study strategies. Just ask a specific question, and I'll provide the most relevant information for your college studies.",
    "what programming language should i learn": "For college students, Python is often recommended as a first language due to its readability and versatility. If you're focusing on web development, JavaScript is essential. For system programming, consider C++. The best choice depends on your specific field of study and career goals.",
    "how to prepare for technical interviews": "For technical interviews, focus on: 1) Strong knowledge of data structures and algorithms, 2) Problem-solving skills through platforms like LeetCode, 3) Understanding system design concepts, 4) Practicing explanations of your thought process, and 5) Reviewing fundamentals of your preferred programming languages. Many college career centers also offer mock technical interviews."
  };

  // Lowercase the query for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Check if we have a predefined response that matches
  for (const key in responses) {
    if (lowerQuery.includes(key)) {
      return responses[key];
    }
  }
  
  // If no predefined response found, generate a generic but helpful response
  if (lowerQuery.includes("what") || lowerQuery.includes("explain") || lowerQuery.includes("define")) {
    return `That's an interesting question about "${query}". As a college student, you might approach this by researching academic papers or textbooks on the topic. I'd recommend checking your university's online library resources or asking a professor during office hours for more detailed guidance. Would you like some tips on how to research this topic effectively?`;
  }
  
  if (lowerQuery.includes("how") || lowerQuery.includes("way") || lowerQuery.includes("method")) {
    return `For your question about "${query}", there are several approaches you could take. This would make an excellent topic for a class project or paper. Consider breaking down the problem into smaller parts and applying concepts from your coursework. Have you discussed this in any of your classes yet?`;
  }
  
  if (lowerQuery.includes("recommend") || lowerQuery.includes("suggest") || lowerQuery.includes("best")) {
    return `Regarding "${query}", my recommendation for college-level work would be to examine this from multiple perspectives. Compare different methodologies and their applications. This shows critical thinking, which professors highly value. Have you considered creating a comparison table for your analysis?`;
  }
  
  // Default response for any other queries
  return `Thanks for your question about "${query}". This is an area where you could apply concepts from your coursework. I'd suggest connecting it to your recent class materials or research papers in this field. Many college assignments require you to make these connections. What specific aspect would you like to explore further?`;
}
