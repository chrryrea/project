import { AcademicCapIcon, CodeBracketIcon, SparklesIcon, ShieldCheckIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="hero min-h-[80vh] flex items-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Transforming Ideas into Digital Reality
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                Full-stack developer crafting innovative solutions that make a difference. 
                Building the future, one line of code at a time.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/projects" className="btn-primary px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View Projects
                </a>
                <a href="/contact" className="btn-secondary px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Authority & Social Proof Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="feature-icon-container mx-auto mb-6" style={{backgroundColor: '#ebf5ff'}}>
                  <ShieldCheckIcon className="feature-icon w-12 h-12" style={{color: '#3b82f6'}} />
                </div>
                <h3 className="text-xl font-bold mb-4">Proven Expertise</h3>
                <p className="text-gray-600">Full-stack developer with a track record of successful project deliveries</p>
              </div>
              <div className="card p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="feature-icon-container mx-auto mb-6" style={{backgroundColor: '#f3e8ff'}}>
                  <UserGroupIcon className="feature-icon w-12 h-12" style={{color: '#8b5cf6'}} />
                </div>
                <h3 className="text-xl font-bold mb-4">Client Success</h3>
                <p className="text-gray-600">Trusted by organizations and peers to deliver high-impact solutions</p>
              </div>
              <div className="card p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="feature-icon-container mx-auto mb-6" style={{backgroundColor: '#e0f2fe'}}>
                  <ChartBarIcon className="feature-icon w-12 h-12" style={{color: '#0ea5e9'}} />
                </div>
                <h3 className="text-xl font-bold mb-4">Measurable Impact</h3>
                <p className="text-gray-600">Solutions that drive real business value and user engagement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Portfolio</span>
              <h2 className="text-4xl font-bold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore my recent works that showcase technical expertise and innovative problem-solving
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card group hover:shadow-xl transition-all duration-300">
                <div className="card-image h-48 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="card-content p-6">
                  <h3 className="text-xl font-bold mb-3">AI Chat Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    Live AI-powered chat application leveraging cutting-edge LLMs
                  </p>
                  <a href="/projects/ai-project" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                    Explore Project <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
              
              <div className="card group hover:shadow-xl transition-all duration-300">
                <div className="card-image h-48 bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="card-content p-6">
                  <h3 className="text-xl font-bold mb-3">Endangered Species Visualization</h3>
                  <p className="text-gray-600 mb-4">
                    Interactive data visualization highlighting conservation efforts via studies of population trends for the African Elephant
                  </p>
                  <a href="/projects/endangered-species" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                    View Visualization <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
              
              <div className="card group hover:shadow-xl transition-all duration-300">
                <div className="card-image h-48 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h10z" />
                  </svg>
                </div>
                <div className="card-content p-6">
                  <h3 className="text-xl font-bold mb-3">Real-time Chatroom</h3>
                  <p className="text-gray-600 mb-4">
                    Modern chat platform with real-time communication capabilities, commands, persisting sessions, and more
                  </p>
                  <a href="/projects/chatroom" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700">
                    Explore <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
