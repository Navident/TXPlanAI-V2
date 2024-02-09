import './SideBar.css';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import homeIcon from '../../assets/home-icon.svg';
import homeIconActive from '../../assets/home-icon-selected.svg';
import newTxPlanIcon from '../../assets/new-tx-plan-icon.svg';
import savedTxPlansIcon from '../../assets/saved-tx-plans-icon.svg';
import providersIcon from '../../assets/providers-icon.svg';
import cdtCodesIcon from '../../assets/cdt-codes-icon.svg';
import settingsIcon from '../../assets/tx-plan-settings-icon.svg';
import settingsIconActive from '../../assets/settings-icon-active.svg';
import settingsIcon2 from '../../assets/tx-plan-settings-icon.svg';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const items = [
        { imgSrc: homeIcon, imgSrcSelected: homeIconActive, text: "Home", path: "" },
        { imgSrc: newTxPlanIcon, imgSrcSelected: newTxPlanIcon, text: "Fee Schedule", path: "feescheduling" },
        { imgSrc: savedTxPlansIcon, imgSrcSelected: savedTxPlansIcon, text: "Saved Tx Plans", path: "savedTxPlans" },
        { imgSrc: providersIcon, imgSrcSelected: providersIcon, text: "Providers", path: "providers" },
        { imgSrc: cdtCodesIcon, imgSrcSelected: cdtCodesIcon, text: "Custom CDT Codes", path: "customcdtCodes" },
        { imgSrc: settingsIcon, imgSrcSelected: settingsIconActive, text: "TX Plan Settings", path: "defaultprocedures" },
        { imgSrc: settingsIcon2, imgSrcSelected: settingsIconActive, text: "Account Info", path: "accountInfo" }

    ];

    const handleItemClick = (path) => {
        let targetPath = path ? `/dashboard/${path}` : '/dashboard';
        if (location.pathname !== targetPath) {
            navigate(targetPath);
        }
    };

    const isActive = (path) => {
        const currentPath = path ? `/dashboard/${path}` : '/dashboard';

        // Check for root path and ensure it's not a part of a longer path
        if (!path) {
            return location.pathname === currentPath;
        }

        // Check if the current path starts with the constructed path and that it's not just the root path
        return location.pathname.startsWith(currentPath) && location.pathname !== '/dashboard';
    };


    const handleMouseEnter = (index) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className={`sidebar-container ${hoveredItem !== null ? 'item-hovered' : ''} box-shadow`}>
            <ul className="sidebar-list">
                {items.map((item, index) => (
                    <li key={index}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''} ${hoveredItem === index ? 'hovered' : ''}`}
                        onClick={() => handleItemClick(item.path)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}>
                        <img src={isActive(item.path) ? item.imgSrcSelected : item.imgSrc} alt={item.text} className="sidebar-icon" />
                        <span className="sidebar-text">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;