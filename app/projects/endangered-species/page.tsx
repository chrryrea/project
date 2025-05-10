import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function EndangeredSpeciesVisualization() {
  return (
    <div>
      <main>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/projects" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-8 font-medium">
            <div className="mr-1">
              <ArrowLeftIcon className="icon-sm" />
            </div>
            <span>Back to Projects</span>
          </Link>
          
          <div className="mb-12 text-center">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2 block">Interactive Data Visualization</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Endangered Species Visualization</h1>
            <p className="text-gray-700 text-lg">
              An interactive tool highlighting the conservation status of endangered African elephants and their habitat loss over time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Interactive maps showing habitat distribution</li>
                  <li>Time-series analysis of population changes</li>
                  <li>Comparative analysis of conservation efforts</li>
                  <li>Data-driven insights on conservation impact</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Technologies</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>React for the frontend interface</li>
                  <li>Recharts for interactive data visualization</li>
                  <li>Axios for data fetching</li>
                  <li>CSS for responsive design</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="visualization-container full-bleed">
            <h2 className="visualization-heading">Live Visualization</h2>
            <iframe 
              src="/visualization/index.html" 
              className="w-full h-[600px] border-0"
              title="Endangered Species Visualization"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Challenges</h2>
            <p className="text-gray-700 mb-4">
              This project required overcoming several technical challenges:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Integrating complex geospatial data with time-series information</li>
              <li>Creating optimized visualizations that work across devices</li>
              <li>Balancing information density with user experience</li>
              <li>Presenting scientific data in an accessible format</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
