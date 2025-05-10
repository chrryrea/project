// Projects page

export default function Projects() {
  return (
    <div>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
        
        {/* Data Visualization Project */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Endangered Species Visualization</h2>
          <p className="text-gray-600 mb-6">
            Interactive visualization of endangered African elephants and habitat loss
          </p>
          <div className="card rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                This data visualization project provides interactive insights into the conservation status of endangered African elephants, their population trends, and habitat changes over time.
              </p>
              <a 
                href="/projects/endangered-species" 
                className="btn btn-primary"
              >
                View Full Visualization
              </a>
            </div>
          </div>
        </section>

        {/* AI Project */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Chat Assistant</h2>
          <p className="text-gray-600 mb-6">
            A cutting-edge AI-powered chat application that provides expert technical assistance
          </p>
          <div className="card rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                This interactive AI assistant demonstrates capabilities in natural language processing and contextual understanding to provide helpful responses to technical questions.
              </p>
              <a 
                href="/projects/ai-project" 
                className="btn btn-primary"
              >
                Try the AI Assistant
              </a>
            </div>
          </div>
        </section>

        {/* Chatroom Project */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Real-time Chatroom</h2>
          <p className="text-gray-600 mb-6">
            A real-time communication platform built with modern web technologies
          </p>
          <div className="card rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                This interactive chatroom demonstrates real-time communication capabilities with multiple rooms and user presence features. Experience seamless messaging with real-time updates and notifications.
              </p>
              <a
                href="/projects/chatroom"
                className="btn btn-primary"
              >
                Try the Chatroom
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
