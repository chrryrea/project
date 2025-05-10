"use client"

import { useState, useEffect, useRef } from 'react'
import ChatForm from './ChatForm'
import MessageList from './MessageList'
import CommandSuggestions from './CommandSuggestions'
import ChatFeatures from './ChatFeatures'
import { Message, Command, ChatFormProps } from './types'

export default function Chatroom({ initialRoom, initialUsername }: ChatFormProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [username, setUsername] = useState(initialUsername)
  const [room, setRoom] = useState(initialRoom)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const commands: Command[] = [
    { name: '/help', description: 'Show available commands' },
    { name: '/clear', description: 'Clear the chat history' },
    { name: '/nick <username>', description: 'Change your username' },
    { name: '/join <room>', description: 'Join a different room' },
    { name: '/users', description: 'Show users in the current room' },
    { name: '/time', description: 'Show current time' },
    { name: '/msg <user> <message>', description: 'Send a private message' },
    { name: '/flip', description: 'Flip a coin (heads or tails)' },
    { name: '/roll [sides]', description: 'Roll a die (default: 6 sides)' },
  ]

  const handleConnect = () => {
    if (username.trim() === '') return
    setIsConnected(true)
    loadMessages()
  }

  const loadMessages = async () => {
    try {
      if (typeof window !== 'undefined') {
        const savedMessages = localStorage.getItem(`chatMessages_${room}`)
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages)
          setMessages(parsedMessages)
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const addMessage = (user: string, text: string, isCommand = false) => {
    const now = new Date()
    const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    const newMessage = { user, text, timestamp, isCommand }

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage]
      saveMessages(updatedMessages)
      return updatedMessages
    })
  }

  const saveMessages = (messages: Message[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`chatMessages_${room}`, JSON.stringify(messages))
      }
    } catch (error) {
      console.error('Error saving messages:', error)
    }
  }

  const processCommand = (commandText: string) => {
    const args = commandText.split(' ')
    const command = args[0].toLowerCase()

    switch (command) {
      case '/help':
        addMessage('System', 'Available commands:', true)
        commands.forEach(cmd => {
          addMessage('System', `${cmd.name} - ${cmd.description}`, true)
        })
        break

      case '/clear':
        setMessages([])
        addMessage('System', 'Chat history cleared.', true)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`chatMessages_${room}`)
        }
        break

      case '/nick':
        if (args.length < 2) {
          addMessage('System', 'Please provide a username. Usage: /nick <username>', true)
          return
        }
        const newUsername = args[1].trim()
        addMessage('System', `Username changed from ${username} to ${newUsername}.`, true)
        setUsername(newUsername)
        break

      case '/join':
        if (args.length < 2) {
          addMessage('System', 'Please provide a room name. Usage: /join <room>', true)
          return
        }
        const newRoom = args[1].trim()
        addMessage('System', `Leaving ${room} and joining ${newRoom}...`, true)
        setRoom(newRoom)
        setMessages([])
        loadMessages()
        break

      case '/time':
        const now = new Date()
        addMessage('System', `Current time: ${now.toLocaleTimeString()}`, true)
        break

      case '/flip':
        const flipResult = Math.random() > 0.5 ? 'HEADS' : 'TAILS'
        addMessage('System', `${username} flipped a coin and got: ${flipResult}`, true)
        break

      case '/roll':
        const sides = args.length > 1 ? parseInt(args[1]) : 6
        if (isNaN(sides)) {
          addMessage('System', `Invalid number of sides. Using default: 6`, true)
        }
        const rollResult = Math.floor(Math.random() * Math.max(1, sides)) + 1
        addMessage('System', `${username} rolled a ${sides}-sided die and got: ${rollResult}`, true)
        break

      case '/users':
        const fakeUsers = ['Alice', 'Bob', 'Charlie', username]
        addMessage('System', `Users in ${room}: ${fakeUsers.join(', ')}`, true)
        break

      case '/msg':
        if (args.length < 3) {
          addMessage('System', 'Please provide a user and message. Usage: /msg <user> <message>', true)
          return
        }
        const targetUser = args[1]
        const message = args.slice(2).join(' ')
        addMessage('System', `Private message to ${targetUser}: ${message}`, true)
        break

      default:
        addMessage('System', `Unknown command: ${command}. Type /help for available commands.`, true)
    }
  }

  const sendMessage = () => {
    if (inputMessage.trim() === '') return

    if (inputMessage.startsWith('/')) {
      processCommand(inputMessage)
    } else {
      addMessage(username, inputMessage)
    }

    setInputMessage('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Real-time Chatroom</h1>
      
      {!isConnected ? (
        <ChatForm
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          onConnect={handleConnect}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Chat Room: {room}</h2>
            <div className="text-sm text-gray-500">
              Logged in as <span className="font-semibold">{username}</span>
            </div>
          </div>

          <MessageList messages={messages} />
          
          <ChatForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
          />
          
          <CommandSuggestions
            commands={commands}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        </div>
      )}

      <ChatFeatures commands={commands} />
    </div>
  )
}
