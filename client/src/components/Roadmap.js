import React from 'react';
import { FaRocket, FaCode, FaBullhorn, FaGlobe } from 'react-icons/fa';
import './Roadmap.css';

const Roadmap = () => {
    const milestones = [
        {
            phase: "Phase 1",
            title: "Development",
            items: [
                "Website launch",
                "Smart contract development",
                "365COIN Token creation",
                "Security audit completion"
            ],
            icon: <FaCode />,
            active: true
        },
        {
            phase: "Phase 2",
            title: "Launch",
            items: [
                "Token presale",
                "DEX listing",
                "Marketing campaign initiation",
                "Community building"
            ],
            icon: <FaRocket />,
            active: false
        },
        {
            phase: "Phase 3",
            title: "Expansion",
            items: [
                "CEX listings [Binance, Bybit, Crypto.com]",
                "Partnership development",
                "Global marketing expansion",
                "Ecosystem growth"
            ],
            icon: <FaBullhorn />,
            active: false
        },
        {
            phase: "Phase 4",
            title: "Global Adoption",
            items: [
                "Major exchange listings",
                "International partnerships",
                "Advanced features rollout",
                "Achieve Top 10 Cryptocurrencies"
            ],
            icon: <FaGlobe />,
            active: false
        }
    ];

    return (
        <section className="roadmap-section">
            <h2 className="roadmap-title">Roadmap</h2>
            <div className="roadmap-timeline">
                {milestones.map((milestone, index) => (
                    <div 
                        key={index} 
                        className={`timeline-item ${milestone.active ? 'active' : ''}`}
                        style={{ '--i': index }}
                    >
                        <div className="timeline-marker">
                            <div className="marker-icon">{milestone.icon}</div>
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-phase">{milestone.phase}</div>
                            <h3>{milestone.title}</h3>
                            <ul>
                                {milestone.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Roadmap; 