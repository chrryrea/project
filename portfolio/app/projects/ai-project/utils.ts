import { formatFileSize } from '../../utils/formatFileSize'
import { Document } from './types'

export const processDocument = async (file: File): Promise<Document | null> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-documents', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to process document')
    }

    const data = await response.json()
    return {
      name: data.name,
      url: data.url,
      size: data.size,
      type: data.type,
    }
  } catch (error) {
    console.error('Error processing document:', error)
    return null
  }
}

export const formatDocumentList = (documents: Document[]): string => {
  return documents
    .map(doc => `
      - ${doc.name} (${formatFileSize(doc.size)})
        Type: ${doc.type}
        URL: ${doc.url}
    `)
    .join('\n')
}

export const validateFile = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.`)
  }

  if (file.size > maxSize) {
    throw new Error(`File size exceeds 10MB limit. Please upload smaller files.`)
  }

  return true
}
