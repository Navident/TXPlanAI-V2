import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import logo from '../../assets/navident-logo.svg';
import { useNavigate } from 'react-router-dom';
import SideBar from "../../Components/SideBar/SideBar";
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
import { StyledAppContainer, StyledMainContentWrapper, StyledContentArea  } from '../../GlobalStyledComponents';
import { selectFacilityName } from '../../Redux/ReduxSlices/User/userSlice';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const facilityName = useSelector(selectFacilityName);

    useEffect(() => {
        // Check if the alert has been shown in this session
        if (!sessionStorage.getItem('alertShown')) {
            // Dispatch showAlert action with the appropriate payload
            dispatch(showAlert({ type: 'success', message: 'Welcome back!' }));
            sessionStorage.setItem('alertShown', 'true');
        }
    }, [dispatch]);


    const handleLogoClick = () => {
        navigate('/'); 
    };

    return (

            <StyledAppContainer>
                <HeaderBar
                    leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" onClick={handleLogoClick} />}
                    rightCornerElement={<div className="headerbar-business-name">{facilityName}</div>}
                    className="dashboard-header"
                    showDropdownArrow={true}
                />
                <StyledMainContentWrapper>
                    <SideBar />
                    <StyledContentArea>                       
                        <Outlet />
                    </StyledContentArea>
                </StyledMainContentWrapper>
            </StyledAppContainer>
    );
};

export default Dashboard;
