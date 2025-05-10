import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PopulationChart = ({ data, selectedRegion, onRegionChange }) => {
  
  // Filter data for the selected Region
  const filteredData = data.filter(item => item.region === selectedRegion);
  
  const chartData = filteredData.map(item => ({
    year: item.year,
    protected: item.protectedPopulation,
    unprotected: item.unprotectedPopulation,
  }));
  
  const handleRegionChange = (e) => {
    onRegionChange(e.target.value);
  };
  
  return (
    <div className="population-chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="protected" 
            name="Protected Areas" 
            stroke="#2e7d32" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="unprotected" 
            name="Unprotected Areas" 
            stroke="#c62828" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="chart-insights">
        <h6>Note: Considering the difficulty in gathering data, and the wide range of estimates, the primary source has been the African Elephant Database, with 'definite' and 'probable' representing protected areas, whereas 'possible' and 'speculative' populations represent unprotected areas. Information is accurate but the margin of error must be accounted for. Over time, data collection methods have improved, leading to gradual increase in Information Quality Index (IQI) score.</h6>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-year">{`Year: ${label}`}</p>
        <p className="tooltip-protected" style={{ color: '#2e7d32' }}>
          {`Protected Areas: ${payload[0].value} individuals`}
        </p>
        <p className="tooltip-unprotected" style={{ color: '#c62828' }}>
          {`Unprotected Areas: ${payload[1].value} individuals`}
        </p>
        <p className="tooltip-total">
          {`Total: ${payload[0].value + payload[1].value} individuals`}
        </p>
      </div>
    );
  }

  return null;
};

export default PopulationChart;