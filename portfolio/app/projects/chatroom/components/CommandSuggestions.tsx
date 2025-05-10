"use client"

import { Command } from './types'

interface CommandSuggestionsProps {
  commands: Command[]
  inputMessage: string
  setInputMessage: (message: string) => void
}

export default function CommandSuggestions({
  commands,
  inputMessage,
  setInputMessage
}: CommandSuggestionsProps) {
  if (!inputMessage.startsWith('/')) return null

  const filteredCommands = commands
    .filter(cmd => cmd.name.startsWith(inputMessage.split(' ')[0]))
    .slice(0, 3)

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
      {filteredCommands.map((cmd, index) => (
        <div 
          key={index} 
          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
          onClick={() => setInputMessage(cmd.name)}
        >
          <span className="font-mono font-semibold">{cmd.name}</span> - {cmd.description}
        </div>
      ))}
    </div>
  )
}
