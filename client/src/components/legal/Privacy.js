import React from 'react';
import './Legal.css';

const Privacy = () => {
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="legal-page" id="privacy-content">
            <div className="legal-container">
                <h1>Privacy Policy</h1>

                <section>
                    <h2>1. Data Collection</h2>
                    <ul>
                        <li>Wallet addresses for transaction processing</li>
                        <li>Transaction history for profit distribution</li>
                        <li>Gaming activity for rewards calculation</li>
                        <li>Optional email for notifications</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Data Usage</h2>
                    <ul>
                        <li>Process profit sharing distributions</li>
                        <li>Verify token holdings and eligibility</li>
                        <li>Send important platform updates</li>
                        <li>Calculate gaming rewards</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Data Protection</h2>
                    <ul>
                        <li>Industry-standard encryption</li>
                        <li>Regular security audits</li>
                        <li>No sharing with third parties</li>
                        <li>Data deletion upon request</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Privacy; 