import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';

import SideBar from "../SideBar/SideBar";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import './Dashboard.css';
import { TextField } from "@mui/material";
import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import { Outlet } from 'react-router-dom';


const Dashboard = () => {

    return (
        <div className="dashboard-wrapper">
            <div className="tx-container">
                <HeaderBar
                    leftCornerElement={<img src={circleIcon} alt="Logo" />}
                    rightCornerElement={<img src={userIcon} alt="User Icon" />}
                    className="dashboard-header"
                />
                <div className="tx-main-content">
                    <SideBar />
                    <div className="tx-content-area">                       
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
