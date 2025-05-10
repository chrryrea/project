"use client"

import { useState } from 'react'
import { Command } from './types'

interface ChatFormProps {
  username: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  onConnect?: () => void
  inputMessage?: string
  setInputMessage?: (message: string) => void
  onSendMessage?: (message: string) => void
}

export default function ChatForm({
  username,
  setUsername,
  room,
  setRoom,
  onConnect,
  inputMessage,
  setInputMessage,
  onSendMessage
}: ChatFormProps) {
  const rooms = ['General', 'Technology', 'Random']
  const [showCommands, setShowCommands] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onConnect) {
      onConnect()
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage?.trim() && onSendMessage) {
      onSendMessage(inputMessage)
      setInputMessage?.('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {onConnect ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">
              Room
            </label>
            <select
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect to Chat
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendMessage} className="flex space-x-2 border-2 border-blue-300 rounded-lg p-2 bg-white shadow-md">
          <input
            type="text"
            value={inputMessage || ''}
            onChange={(e) => setInputMessage?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputMessage?.trim()) {
                handleSendMessage(e)
              }
            }}
            className="flex-1 rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium shadow-sm"
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}
