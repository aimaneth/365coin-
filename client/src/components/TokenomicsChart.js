import React from 'react';

const TokenomicsChart = ({ distribution }) => {
    return (
        <div className="tokenomics-chart">
            {distribution.map((item, index) => (
                <div key={index} className="chart-item">
                    <div className="chart-bar">
                        <div 
                            className="bar-fill"
                            style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                            }}
                        />
                    </div>
                    <div className="chart-label">
                        <span className="label-text">{item.category}</span>
                        <span className="label-percentage">{item.percentage}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TokenomicsChart; 