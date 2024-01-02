import './SideBar.css';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import homeIcon from '../../assets/home-icon.svg';
import newTxPlanIcon from '../../assets/new-tx-plan-icon.svg';
import savedTxPlansIcon from '../../assets/saved-tx-plans-icon.svg';
import providersIcon from '../../assets/providers-icon.svg';
import cdtCodesIcon from '../../assets/cdt-codes-icon.svg';
import settingsIcon from '../../assets/tx-plan-settings-icon.svg';
import settingsIcon2 from '../../assets/tx-plan-settings-icon.svg';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
     const [hoveredItem, setHoveredItem] = useState(null);

    const items = [
        { imgSrc: homeIcon, text: "Home", path: "" }, 
        { imgSrc: newTxPlanIcon, text: "New Tx Plan", path: "newTxPlan" },
        { imgSrc: savedTxPlansIcon, text: "Saved Tx Plans", path: "savedTxPlans" },
        { imgSrc: providersIcon, text: "Providers", path: "providers" },
        { imgSrc: cdtCodesIcon, text: "Custom CDT Codes", path: "customizeCDTCodes" },
        { imgSrc: settingsIcon, text: "TX Plan Settings", path: "defaultprocedures" },
        { imgSrc: settingsIcon2, text: "Account Info", path: "accountInfo" }
        
    ];

    const handleItemClick = (path) => {
        let targetPath = path ? `/dashboard/${path}` : '/dashboard';
        if (location.pathname !== targetPath) {
            navigate(targetPath);
        }
    };


    const isActive = (path) => {
        const currentPath = path ? `/dashboard/${path}` : '/dashboard';
        return location.pathname === currentPath;
    };


    const handleMouseEnter = (index) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className={`sidebar-container ${hoveredItem !== null ? 'item-hovered' : ''}`}>
            <ul className="sidebar-list">
                {items.map((item, index) => (
                    <li key={index}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''} ${hoveredItem === index ? 'hovered' : ''}`}
                        onClick={() => handleItemClick(item.path)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}>
                        <img src={item.imgSrc} alt={item.text} className="sidebar-icon" />
                        <span className="sidebar-text">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;