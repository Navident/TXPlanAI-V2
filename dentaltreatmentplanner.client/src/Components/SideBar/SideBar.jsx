import './SideBar.css';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import homeIcon from '../../assets/home-icon.svg';
import homeIconActive from '../../assets/home-icon-selected.svg';
import newTxPlanIcon from '../../assets/new-tx-plan-icon.svg';
import savedTxPlansIcon from '../../assets/saved-tx-plans-icon.svg';
import savedTxPlansIconActive from '../../assets/saved-tx-plans-icon-active.svg';
import providersIcon from '../../assets/providers-icon.svg';

import cdtCodesIcon from '../../assets/cdt-codes-icon.svg';
import cdtCodesIconActive from '../../assets/cdt-codes-icon-active.svg';

import settingsIcon from '../../assets/tx-plan-settings-icon.svg';
import settingsIconActive from '../../assets/tx-plan-settings-icon-active.svg';

import accountInfoIconActive from '../../assets/account-info-icon-active.svg';
import accountInfoIcon from '../../assets/account-info-icon.svg';


import feeSchedulingIcon from '../../assets/fee-scheduling-icon.svg';
import feeSchedulingIconActive from '../../assets/fee-scheduling-icon-active.svg';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const items = [
        { imgSrc: homeIcon, imgSrcSelected: homeIconActive, text: "Home", path: "" },
        { imgSrc: feeSchedulingIcon, imgSrcSelected: feeSchedulingIconActive, text: "Fee Schedule", path: "feescheduling" },
        { imgSrc: savedTxPlansIcon, imgSrcSelected: savedTxPlansIconActive, text: "Saved Tx Plans", path: "all-saved-patient-tx-plans" },
        { imgSrc: providersIcon, imgSrcSelected: providersIcon, text: "Providers", path: "providers" },
        { imgSrc: cdtCodesIcon, imgSrcSelected: cdtCodesIconActive, text: "Custom CDT Codes", path: "customcdtCodes" },
        { imgSrc: settingsIcon, imgSrcSelected: settingsIconActive, text: "TX Plan Settings", path: "defaultprocedures" },
        { imgSrc: accountInfoIcon, imgSrcSelected: accountInfoIconActive, text: "Account Info", path: "accountinfo" }

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