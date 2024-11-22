import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const TeamMember = ({ name, role, image, linkedin }) => {
    return (
        <div className="team-member">
            <div className="member-image">
                <img src={image} alt={name} />
            </div>
            <div className="member-info">
                <h3>{name}</h3>
                <p className="member-role">{role}</p>
                {linkedin && (
                    <a 
                        href={linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="linkedin-link"
                    >
                        <FaLinkedin />
                    </a>
                )}
            </div>
        </div>
    );
};

export default TeamMember; 