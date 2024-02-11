import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import logo from '../../assets/navident-logo.svg';
import Alert from "../../Components/Common/Alert/Alert";
import { useNavigate } from 'react-router-dom';
import SideBar from "../../Components/SideBar/SideBar";
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { StyledAppContainer, StyledMainContentWrapper, StyledContentArea  } from '../../GlobalStyledComponents';
import useTreatmentPlan from '../../Contexts/TreatmentPlanContext/useTreatmentPlan';

const Dashboard = () => {
    const { businessName, categories, isLoading } = useBusiness();
    const navigate = useNavigate();
    const { showAlert } = useTreatmentPlan(); 

    useEffect(() => {
        // Check if the alert has been shown in this session
        if (!sessionStorage.getItem('alertShown')) {
            showAlert('success', 'Welcome back!');
            sessionStorage.setItem('alertShown', 'true');
        }
    },[]);


    const handleLogoClick = () => {
        navigate('/'); 
    };

    return (
        <div className="dashboard-wrapper">
            <StyledAppContainer>
                <HeaderBar
                    leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" onClick={handleLogoClick} />}
                    rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                    className="dashboard-header"
                    showDropdownArrow={true}
                />
                <StyledMainContentWrapper>
                    <SideBar />
                    <StyledContentArea>                       
                        <Outlet context={{ categories, isLoading }} />
                    </StyledContentArea>
                </StyledMainContentWrapper>
            </StyledAppContainer>
        </div>
    );
};

export default Dashboard;
