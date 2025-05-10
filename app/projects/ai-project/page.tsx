"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { DocumentTextIcon, QuestionMarkCircleIcon, PaperClipIcon } from '@heroicons/react/24/outline'
import { Message, Document, DocumentUploadResponse, DocumentQAResponse } from './types'
import { processDocument, formatDocumentList, validateFile } from './utils'
import { formatFileSize } from '../../utils/formatFileSize'
import ReactMarkdown from 'react-markdown'

interface AIProjectProps {
  initialMessages?: Message[]
}

export default function AIProject({ initialMessages }: AIProjectProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<string>('')
  const [response, setResponse] = useState<string>('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

  // Load initial messages from localStorage if available
  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatMessages')
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      } catch (err) {
        console.error('Error loading saved messages:', err)
        toast.error('Failed to load saved messages')
      }
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('aiChatMessages', JSON.stringify(messages))
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    setLoading(true)
    setError(null)

    try {
      // Add user message with timestamp
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: format(new Date(), 'HH:mm')
      }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      // Simulate API call with proper error handling
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      // Add assistant response with timestamp
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: format(new Date(), 'HH:mm')
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      // Add error message to chat
      const systemMessage: Message = {
        role: 'system',
        content: `Sorry, there was an error processing your request: ${errorMessage}. Please try again.`,
        timestamp: format(new Date(), 'HH:mm')
      }
      setMessages(prev => [...prev, systemMessage])
      
      // Show toast notification
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return
    
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => formData.append('documents', file))
      
      const response = await fetch('/api/upload-documents', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (response.ok) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Error uploading documents:', error)
      toast.error('Failed to upload documents')
    } finally {
      setUploading(false)
    }
  }

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setResponse('Please enter a question to continue.')
      return
    }
    
    if (documents.length === 0) {
      setResponse('Please upload at least one document before asking questions.')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/document-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, documents: documents.map(doc => doc.url) }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response')
      }
      
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('aiChatMessages')
    toast.success('Chat cleared successfully')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Document AI Assistant
          <span className="text-blue-600 ml-2">📄🔍🤖</span>
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          A powerful AI system that analyzes your documents and provides accurate answers to your questions.
        </p>
      </div>

      {/* Key Features Section */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features:</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              <DocumentTextIcon className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm">Document Upload & Analysis</span>
          </div>
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm">Contextual Question Answering</span>
          </div>
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              <PaperClipIcon className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm">File Attachment Support</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Chat History</h2>
          <button
            onClick={clearChat}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Chat
          </button>
        </div>

        <div className="h-96 overflow-y-auto mb-6">
          <AnimatePresence mode="wait">
            {messages.map((message: Message, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`mb-4 ${
                  message.role === 'user'
                    ? 'text-right'
                    : message.role === 'assistant'
                    ? 'text-left'
                    : 'text-center'
                }`}
              >
                <div className={`inline-block max-w-3/4 rounded-lg px-4 py-2 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : message.role === 'assistant'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  <div className="font-semibold text-xs mb-1">
                    {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'AI Assistant' : 'System'}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs opacity-75 mt-1">{message.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim() !== '') {
                handleSubmit(e)
              }
            }}
            disabled={loading}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Type your message..."
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={loading || input.trim() === ''}
            className={`px-4 py-2 rounded-md ${
              loading || input.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="Send message"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Thinking...
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Document Upload Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
              Upload Documents
            </label>
            <input
              id="documents"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {documents.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Uploaded Documents:</h3>
              <pre className="text-sm whitespace-pre-wrap">{formatDocumentList(documents)}</pre>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Ask a Question
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type your question here..."
              disabled={uploading}
            />
          </div>

          <button
            onClick={handleQuestionSubmit}
            disabled={uploading || documents.length === 0 || !query.trim()}
            className={`w-full py-2 px-4 rounded-md ${
              uploading || documents.length === 0 || !query.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Processing...
              </div>
            ) : (
              'Get Answer'
            )}
          </button>

          {response && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
