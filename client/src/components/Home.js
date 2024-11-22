import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import HeroAnimation from './HeroAnimation';
import Features from './Features';
import Roadmap from './Roadmap';
import FAQ from './FAQ';

const Home = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage("Thanks for joining! We'll keep you updated.");
            setEmail('');
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-wrapper">
                    {/* Left Content */}
                    <div className="hero-content">
                        <h1>
                            <span style={{ color: 'var(--primary)' }}>365coin</span>
                            <br />
                            <span>Make Better Life With Trusted CryptoCoin</span>
                        </h1>
                        <p className="hero-subtitle">
                            Use modern progressive technologies of Bitcoin to earn money. Early investors gain 
                            exclusive access to our revolutionary ecosystem.
                        </p>

                        <div className="get-started-section">
                            <form onSubmit={handleSubmit} className="email-signup-form">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email for updates"
                                        required
                                        className="email-input"
                                    />
                                    <button 
                                        type="submit" 
                                        className="submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                Get Updates <FaArrowRight />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`message ${message.includes('Thanks') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Presale Card */}
                    <div className="hero-right">
                        <HeroAnimation />
                    </div>
                </div>
            </section>

            {/* New Sections */}
            <Features />
            <Roadmap />
            <FAQ />
        </div>
    );
};

export default Home; 