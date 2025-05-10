import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = Array.from(formData.getAll('documents')) as File[]
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const documentPaths: string[] = []
    
    for (const file of files) {
      if (!file) continue
      
      // Create a unique filename
      const fileName = `${Date.now()}_${file.name}`
      const filePath = join(process.cwd(), 'public', 'documents', fileName)
      
      // Convert ArrayBuffer to Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Save the file
      await writeFile(filePath, buffer)
      documentPaths.push(filePath)
    }

    return NextResponse.json({ documents: documentPaths })
  } catch (error) {
    console.error('Error uploading documents:', error)
    return NextResponse.json(
      { error: 'Failed to upload documents' },
      { status: 500 }
    )
  }
}
