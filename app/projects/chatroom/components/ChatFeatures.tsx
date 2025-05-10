"use client"

import { Command } from './types'

interface ChatFeaturesProps {
  commands: Command[]
}

export default function ChatFeatures({ commands }: ChatFeaturesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Features:</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
        <li>Real-time messaging</li>
        <li>Multiple chat rooms</li>
        <li>Persistent chat history (saved locally)</li>
        <li>Built-in commands (try typing /help, /flip, /roll)</li>
        <li>User presence</li>
        <li>Responsive design</li>
      </ul>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Commands:</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-600">
        {commands.map((cmd, index) => (
          <li key={index}>
            <span className="font-mono font-semibold">{cmd.name}</span> - {cmd.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
