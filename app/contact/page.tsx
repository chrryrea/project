"use client"

import { useState } from 'react'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Here we would typically make an API call to send the message
      // For now, we'll just show a success message
      setSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-10 rounded-2xl shadow-md">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">Get in Touch</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
        </div>



        {/* Contact Form */}
        <div className="card p-8 border border-gray-100 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                placeholder="Your message here..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {success && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-md border border-green-100">
              Message sent successfully! I&apos;ll get back to you soon.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
