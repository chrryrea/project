import React from 'react';

const InfoCard = ({ title, value, description, trend }) => {
  let trendIndicator = null;
  if (trend) {
    const isPositive = !trend.includes('-');
    const trendColor = isPositive ? '#2e7d32' : '#c62828';
    const trendIcon = isPositive ? '↑' : '↓';
    
    trendIndicator = (
      <span className="trend-indicator" style={{ color: trendColor }}>
        {trendIcon} {trend}
      </span>
    );
  }

  return (
    <div className="info-card">
      <h3 className="card-title">{title}</h3>
      <div className="card-value-container">
        <div className="card-value">{value}</div>
        {trendIndicator}
      </div>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default InfoCard;