export interface Message {
  user: string
  text: string
  timestamp: string
  isCommand?: boolean
}

export interface Command {
  name: string
  description: string
}

export interface ChatFormProps {
  username: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  onConnect: () => void
  inputMessage?: string
  setInputMessage?: (message: string) => void
  onSendMessage?: (message: string) => void
}

export interface MessageListProps {
  messages: Message[]
}

export interface CommandSuggestionsProps {
  commands: Command[]
  inputMessage: string
  setInputMessage: (message: string) => void
}

export interface ChatFeaturesProps {
  commands: Command[]
}
