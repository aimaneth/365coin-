import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        { question: "What is 365 Coin?", answer: "365 Coin is a decentralized finance platform offering innovative solutions." },
        { question: "How can I participate in the ICO?", answer: "You can participate by connecting your wallet and purchasing tokens." },
        { question: "Is my investment secure?", answer: "Yes, our platform is fully audited and secure." }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                        <div className="faq-question" onClick={() => toggleFAQ(index)}>
                            <h3>{faq.question}</h3>
                            <span className="faq-icon">
                                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ; 