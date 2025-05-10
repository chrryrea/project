"use client"

import { Message } from './types'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="bg-gray-50 rounded-lg border-3 border-blue-500 shadow-lg h-96 overflow-y-auto p-4 mb-4 outline outline-2 outline-blue-300 outline-offset-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-32">No messages yet. Start the conversation!</div>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.user === 'System' ? 'text-center' : ''}`}>
            <div className={`inline-block max-w-3/4 rounded-lg px-4 py-2 shadow-sm ${
              msg.user === 'System' 
                ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border border-gray-300' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            } ${msg.isCommand ? 'italic opacity-75' : ''}`}>
              {msg.user !== 'System' && (
                <div className="font-semibold text-xs mb-1">{msg.user}</div>
              )}
              <div>{msg.text}</div>
              <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
    </div>
  )
}
