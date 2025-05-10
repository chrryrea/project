import React from 'react';

// A placeholder component for the conservation map visualization
const ConservationMap = ({ region }) => {
  const getConservationAreas = () => {
    switch(region) {
      case 'Central Africa':
        return {
          countries: ['Cameroon', 'Central African Republic', 'Chad', 'Congo', 'Dem. Rep. of Congo', 'Eq. Guinea', 'Gabon'],
          totalArea: '783,085 sq km',
          effectiveness: 'Low'
        };
      case 'Western Africa':
        return {
          countries: ['Benin', 'Burkino Faso', `Cote d'Ivoire`, 'Ghana', 'Guinea', 'Guinea Bissau', ' Liberia', 'Mali', 'Niger', 'Nigeria', 'Senegal', 'Sierra Leone', 'Togo'],
          totalArea: '142,500 sq km',
          effectiveness: 'High'
        };
      case 'Eastern Africa':
        return {
          countries: ['Eritrea', 'Ethiopia', 'Kenya', 'Rwanda', 'Somalia', 'South Sudan', 'Tanzania', 'Uganda'],
          totalArea: '880,648 sq km',
          effectiveness: 'Moderate'
        };
      case 'Southern Africa':
        return {
          countries: ['Angola', 'Botswana', 'Malawi', 'Mozambique', 'Namibia', 'South Africa', 'Swaziland', 'Zambia', 'Zimbabwe'],
          totalArea: '1,325,998 sq km',
          effectiveness: 'Moderate'
        };
        default:
        return {
          countries: [''],
          totalArea: 'N/A',
          effectiveness: 'N/A'
        };
    }
  };
  
  const conservationData = getConservationAreas();
  
  return (
    <div className="conservation-map">
      <div className="map-placeholder">
        {/*this would be a map component*/}
        <div className="map-visualization">
          <div className="map-title">
            {region.replace('_', ' ')}
          </div>
          <div className="map-image" style={{ 
            backgroundColor: '#e0e0e0', 
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            [Interactive map would display {region.replace('_', ' ')}n habitats and protected areas]
          </div>
        </div>
      </div>
      
      <div className="conservation-stats">
        <div className="stat-item">
          <div className="stat-label">Countries</div>
          <div className="stat-value">
            {conservationData.countries.join(', ')}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Total Protected Area</div>
          <div className="stat-value">{conservationData.totalArea}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Protection Effectiveness</div>
          <div className="stat-value">{conservationData.effectiveness}</div>
        </div>
      </div>
    </div>
  );
};

export default ConservationMap;