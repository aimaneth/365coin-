import React from 'react';
import './Legal.css';

const Cookies = () => {
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="legal-page" id="cookies-content">
            <div className="legal-container">
                <h1>Cookie Policy</h1>

                <section>
                    <h2>1. Essential Cookies</h2>
                    <ul>
                        <li>Wallet connection status</li>
                        <li>Authentication tokens</li>
                        <li>Session security</li>
                        <li>User preferences</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Analytics Cookies</h2>
                    <ul>
                        <li>Usage statistics</li>
                        <li>Performance monitoring</li>
                        <li>User behavior analysis</li>
                        <li>Feature optimization</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Cookie Control</h2>
                    <ul>
                        <li>You can delete or block cookies</li>
                        <li>Essential cookies cannot be disabled</li>
                        <li>Settings available in your browser</li>
                        <li>Third-party cookies can be blocked</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Cookies; 