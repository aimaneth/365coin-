import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What is 365 Coin?",
            answer: "365 Coin is a revolutionary cryptocurrency project built on the Binance Smart Chain, designed to provide innovative DeFi solutions and sustainable returns for investors through our unique tokenomics and ecosystem."
        },
        {
            question: "How can I participate in the presale?",
            answer: "To participate in the presale, simply connect your Web3 wallet (like MetaMask), choose your contribution amount in BNB or USDT, and click the 'Buy Tokens' button. The minimum contribution is 0.1 BNB or equivalent."
        },
        {
            question: "When will trading go live?",
            answer: "Trading will go live immediately after the presale ends and liquidity is added to major DEXes. We'll announce the exact date and time across all our social media channels."
        },
        {
            question: "Is the smart contract audited?",
            answer: "Yes, our smart contract has undergone thorough security audits by leading blockchain security firms. The audit reports are available on our website and GitHub repository."
        },
        {
            question: "What are the tokenomics?",
            answer: "365 Coin features a deflationary mechanism with 5% of each transaction distributed to holders, 3% added to liquidity, and 2% burned forever. This creates a sustainable ecosystem that rewards long-term holders."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                    >
                        <div 
                            className="faq-question"
                            onClick={() => toggleFAQ(index)}
                        >
                            <h3 className="question-text">{faq.question}</h3>
                            <span className="faq-icon">
                                <FaChevronDown />
                            </span>
                        </div>
                        <div className="faq-answer">
                            <div className="answer-content">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ; 