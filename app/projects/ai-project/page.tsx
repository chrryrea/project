"use client"

import { useState, useRef, useEffect } from 'react'

const API_URL = "https://api-inference.huggingface.co/models/gpt2"; // Example free endpoint

export default function AIProjectPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setLoading(true)
    const userInput = input
    setInput("")
    try {
      // Call a free public API (HuggingFace Inference API for GPT-2)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: userInput })
      })
      const data = await response.json()
      let aiText = "Sorry, no response."
      if (Array.isArray(data) && data[0]?.generated_text) {
        aiText = data[0].generated_text.replace(userInput, "").trim()
      } else if (data?.generated_text) {
        aiText = data.generated_text.replace(userInput, "").trim()
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiText }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, there was an error." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">AI Chat Demo</h1>
      <p className="text-center text-gray-600 mb-8">Chat with a free public AI model. No login required.</p>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 h-[500px] overflow-y-auto flex flex-col">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center my-auto">Start the conversation below.</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[75%] shadow-sm text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center disabled:opacity-50"
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6l10 1.5-10 1.5v6z" />
          </svg>
        </button>
      </form>
    </div>
  )
} 