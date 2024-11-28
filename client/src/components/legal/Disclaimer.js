import React from 'react';
import './Legal.css';

const Disclaimer = () => {
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="legal-page" id="disclaimer-content">
            <div className="legal-container">
                <h1>Disclaimer</h1>

                <section>
                    <h2>1. Investment Risks</h2>
                    <ul>
                        <li>Cryptocurrency investments are highly volatile</li>
                        <li>Past performance does not guarantee future results</li>
                        <li>Only invest what you can afford to lose</li>
                        <li>Do your own research before investing</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Platform Usage</h2>
                    <ul>
                        <li>Not financial advice - consult professionals</li>
                        <li>Smart contracts carry inherent risks</li>
                        <li>Users accept all platform risks</li>
                        <li>No guarantees of profit or returns</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Legal Compliance</h2>
                    <ul>
                        <li>Users must comply with local laws</li>
                        <li>Not available in restricted jurisdictions</li>
                        <li>KYC/AML procedures may apply</li>
                        <li>Users responsible for taxes</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Disclaimer; 