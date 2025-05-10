import React, { useState, useEffect } from 'react';
import './App.css';
import PopulationChart from './components/PopulationChart';
import InfoCard from './components/InfoCard';
import ConservationMap from './components/ConservationMap';
import { samplePopulationData, getTrendData } from './utils/sampleData';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('Central Africa');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const newStats = getTrendData(selectedRegion);
      setStats(newStats);
      setLoading(false);
    }, 500);
  }, [selectedRegion]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>African Elephant Population Visualization</h1>
        <p>Exploring the impact of conservation efforts on the African Elephant</p>
      </header>
      
      <nav className="region-nav">
        <button 
          className={selectedRegion === 'Central Africa' ? 'active' : ''} 
          onClick={() => handleRegionChange('Central Africa')}
        >
          Central Africa
        </button>
        <button 
          className={selectedRegion === 'Western Africa' ? 'active' : ''} 
          onClick={() => handleRegionChange('Western Africa')}
        >
          Western Africa
        </button>
        <button 
          className={selectedRegion === 'Southern Africa' ? 'active' : ''} 
          onClick={() => handleRegionChange('Southern Africa')}
        >
          Southern Africa
        </button>
        <button 
          className={selectedRegion === 'Eastern Africa' ? 'active' : ''} 
          onClick={() => handleRegionChange('Eastern Africa')}
        >
          Eastern Africa
        </button>
      </nav>
      
      <main className="App-main">
        {loading ? (
          <div className="loading-indicator">Loading data...</div>
        ) : (
          <>
            <div className="info-cards">
              <InfoCard
                title="Current Population"
                value={stats.currentTotal.toLocaleString()}
                description={`Total estimated Region population as of 2016, compared to 1995`}
                trend={stats.totalChange}
              />
              <InfoCard
                title="Protected Area Change"
                value={stats.protectedChange}
                description={`Change in population in protected areas since 1995`}
              />
              <InfoCard
                title="Unprotected Area Change"
                value={stats.unprotectedChange}
                description={`Change in population in unprotected areas since 1995`}
              />
              <InfoCard
                title="Conservation Impact"
                value={`${stats.effectivenessRatio}x`}
                description={`Relative impact of protected areas on population stability`}
              />
            </div>
            
            <div className="visualization-container">
              <div className="chart-section">
                <h2>Population Trends (1995-2016)</h2>
                <PopulationChart 
                  data={samplePopulationData} 
                  selectedRegion={selectedRegion}
                  onRegionChange={handleRegionChange}
                />
              </div>
              
              <div className="map-section">
                <h2>Conservation Areas Impact</h2>
                <ConservationMap region={selectedRegion} />
              </div>
            </div>
            
            <div className="insights-section">
              <h2>Key Conservation Insights</h2>
              <div className="insights-content">
              <div className="insight-card">
              <h3>Protected Areas Effectiveness</h3>
              <p>
              {selectedRegion === 'Central Africa'
                ? 'Protected areas in Central Africa have maintained relatively stable elephant populations despite severe regional pressures. However, they\'ve proven insufficient alone, with protected populations declining by 32% from 1995 to 2016. The ratio of protected to unprotected elephants has shifted from 40:60 to 48:52, indicating increased importance of formal conservation areas as outside populations face greater threats.'
                : selectedRegion === 'Western Africa'
                ? 'Protected areas in West Africa have demonstrated significant success, with protected populations nearly tripling from 4,136 to 11,618 between 1995-2016. As unprotected populations declined by 45%, protected areas now host 67% of the region\'s elephants compared to just 28% in 1995, underscoring their critical role in the region\'s conservation strategy.'
                : selectedRegion === 'Southern Africa'
                ? 'Southern Africa demonstrates the highest effectiveness of protected areas, with populations inside reserves growing by 57% from 1995 to 2016. By 2016, protected areas held 90% of the region\'s elephants, showing robust conservation governance. Some protected areas now approach or exceed ecological carrying capacity, presenting new management challenges.'
                : selectedRegion === 'Eastern Africa'
                ? 'Eastern Africa shows how protected areas can be vulnerable to determined poaching efforts. After steady growth to 2007, protected populations plummeted by 48% by 2016 due to an intense poaching crisis. Though protected areas still housed nearly 80% of elephants in 2016, the dramatic decline demonstrates that designation alone doesn\'t ensure protection.'
                : ``
              }
              </p>
              </div>
                <div className="insight-card">
              <h3>Threats and Challenges</h3>
              <p>
              {selectedRegion === 'Central Africa'
                ? 'Central Africa faces severe poaching pressure driven by ivory trade, exacerbated by civil unrest and armed conflicts that hamper conservation efforts. Forest elephants, primarily found in this region, face additional threats from logging, mining, and infrastructure development that fragment critical habitat. Weak governance and limited resources for wildlife management further complicate conservation efforts.'
                : selectedRegion === 'Western Africa'
                ? 'West Africa\'s elephants face extreme habitat fragmentation, creating small isolated populations vulnerable to genetic bottlenecks and local extinction. Agricultural expansion and human population growth continue to encroach on remaining elephant ranges. Ivory poaching remains a threat, though reduced elephant numbers mean less targeted pressure than other regions.'
                : selectedRegion === 'Southern Africa'
                ? 'The region faces unique challenges from overpopulation in some protected areas, leading to habitat degradation and increased human-wildlife conflict in border zones. While direct poaching has been better controlled than other regions, drought and climate change impact water resources critical for elephant survival. Cross-border poaching incursions continue to threaten border populations.'
                : selectedRegion === 'Eastern Africa'
                ? 'The severe poaching crisis of 2007-2013 was driven by high ivory prices and organized criminal networks. While somewhat reduced, these pressures continue alongside expanding agriculture, settlements, and infrastructure that fragment migration corridors. Climate change has intensified droughts, forcing elephants to move beyond protected boundaries and increasing conflict with humans.'
                : ``
              }
              </p>
              </div>
                <div className="insight-card">
              <h3>Future Conservation Priorities</h3>
              <p>
              {selectedRegion === 'Central Africa'
                ? 'Future priorities include strengthening anti-poaching within protected areas, establishing functional wildlife corridors between isolated populations, supporting transboundary conservation initiatives, and engaging local communities in conservation. Improving monitoring capabilities and governance structures while addressing root causes of poaching are essential for long-term recovery.'
                : selectedRegion === 'Western Africa'
                ? 'Conservation must focus on protecting remaining small populations while enhancing connectivity between isolated herds. Transboundary cooperation is essential as many populations cross international borders. Community-based conservation approaches that provide economic incentives are critical to reduce human-elephant conflict and secure existing habitat corridors.'
                : selectedRegion === 'Southern Africa'
                ? 'Management priorities include addressing ecological impacts of high elephant densities, mitigating human-elephant conflict, and maintaining robust anti-poaching operations. Transfrontier conservation areas need continued support to ensure landscape-level protection. Sustainable tourism models must be developed to ensure long-term financial sustainability of conservation efforts.'
                : selectedRegion === 'Eastern Africa'
                ? 'Rebuilding anti-poaching capacity and intelligence networks is essential to protect remaining populations. Restoring and protecting historical migration corridors between major protected areas will support population resilience. Community-based conservation must be strengthened to reduce conflict and create incentives for coexistence in buffer zones surrounding parks and reserves.'
                : ``
              }
              </p>
              </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Data sources: IUCN Red List, African Elephant Database, Great Elephant Census</p>
        <p>Created for IS219 by Ian Espinal 2025</p>
      </footer>
    </div>
  );
}

export default App;