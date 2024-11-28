import React from 'react';
import './Legal.css';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const Terms = () => {
    useScrollToTop();

    return (
        <div className="legal-page" id="terms-content">
            <div className="legal-container">
                <h1>Terms and Conditions</h1>

                <section>
                    <h2>1. Presale Terms</h2>
                    <ul>
                        <li>Presale will end once we hit 100M cap</li>
                        <li>365Coin can only be sold after official listing on exchanges</li>
                        <li>Presale investors will receive a share of casino profits</li>
                        <li>Casino profit distribution occurs weekly based on holding percentage</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Investment Terms</h2>
                    <ul>
                        <li>Minimum investment: 0.1 BNB</li>
                        <li>Maximum investment: 50 BNB</li>
                        <li>Tokens are locked until official listing</li>
                        <li>Smart contract is audited and verified</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Profit Sharing</h2>
                    <ul>
                        <li>Weekly profit distribution from casino operations</li>
                        <li>Distribution based on token holding percentage</li>
                        <li>Automatic distribution through smart contract</li>
                        <li>Minimum holding required: 100,000 365COIN</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Terms; 