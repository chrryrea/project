export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface Document {
  name: string
  url: string
  size: number
  type: string
}

export interface APIResponse {
  success: boolean
  message?: string
  error?: string
  data?: unknown
}

export interface DocumentUploadResponse extends APIResponse {
  documents: Document[]
}

export interface DocumentQAResponse extends APIResponse {
  response: string
}
