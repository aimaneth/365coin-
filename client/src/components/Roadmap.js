import React from 'react';
import { FaRocket, FaCode, FaBullhorn, FaGlobe, FaTimes, FaClock } from 'react-icons/fa';

const Roadmap = () => {
    const milestones = [
        { phase: "Phase 1", title: "Development", items: ["Website launch", "365COIN Token sale"], icon: <FaCode />, active: true },
        { phase: "Phase 2", title: "Launch", items: ["One-way 365COIN launch", "[Binance, Bybit, Crypto.com]"], icon: <FaRocket />, active: false },
        { phase: "Phase 3", title: "Expansion", items: ["Bring 365COIN worldwide","International partnerships", "Global marketing", "Achieve Top 10 Cryptocurrencies within 3 years"], icon: <FaGlobe />, active: false },
        { phase: "Phase 4", title: "Freedom", items: ["Our plan is to achieve tiered freedom to all stakeholders"], icon: <FaClock />, active: false }
    ];

    return (
        <section className="roadmap-section">
            <h2>Roadmap</h2>
            <div className="roadmap-timeline">
                {milestones.map((milestone, index) => (
                    <div key={index} className={`timeline-item ${milestone.active ? 'active' : ''}`} style={{ '--i': index }}>
                        <div className="timeline-marker">
                            <div className="marker-icon">{milestone.icon}</div>
                            {index < milestones.length - 1 && <div className="timeline-connector" />}
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