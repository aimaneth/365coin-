import React from 'react';
import Hero from './Hero';
import Roadmap from './Roadmap';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div className="home">
            <Hero />
            <Roadmap />
            <FAQ />
        </div>
    );
};

export default Home; 