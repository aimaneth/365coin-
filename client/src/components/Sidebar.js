import React from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ collapsed, toggleSidebar }) => {
    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">MyApp</h2>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
                </button>
            </div>
            <nav className="sidebar-nav">
                <a href="#profile" className="nav-link">
                    <FaUser />
                    <span>Profile</span>
                </a>
                <a href="#settings" className="nav-link">
                    <FaCog />
                    <span>Settings</span>
                </a>
                <a href="#logout" className="nav-link">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </a>
            </nav>
            <div className="sidebar-footer">
                <p>© 2023 MyApp</p>
                <a href="#contact">Contact Us</a>
            </div>
        </div>
    );
};

export default Sidebar; 