
import { TextField } from "@mui/material";
import './Dashboard.css'; 
import SideBar from "../SideBar/SideBar";
import HeaderBar from "../HeaderBar/HeaderBar"; 
import TreatmentPlanOutput from "../TreatmentPlanOutput/TreatmentPlanOutput";
import React, { useState, useEffect } from 'react';
import PenIcon from '../../assets/pen-icon.svg';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../ClientServices/apiService';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleUserIconClick = () => {
        navigate("/DefaultProcedures"); // This will navigate to the DefaultProcedures page
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Here I will Implement search functionality or pass the search query to the parent component
    };

    const [inputText, setInputText] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState(null);
    const [treatmentPlanId, setTreatmentPlanId] = useState(null);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    useEffect(() => {
        if (treatmentPlanId) {
            console.log("Attempting to retrieve treatment plan now");
            getTreatmentPlanById(treatmentPlanId, setTreatmentPlan);
        }
    }, [treatmentPlanId]);

    const handleGetTreatmentPlanById = async () => {
        const id = 101; // Hardcoded ID
        setTreatmentPlanId(id); // Set the treatmentPlanId state
        console.log("Attempting to retrieve treatment plan now");
        await getTreatmentPlanById(id, setTreatmentPlan);
    };


    return (
        <div className="tx-container">
            <HeaderBar
                leftCornerElement={<img src={circleIcon} alt="Logo" />}
                rightCornerElement={<img src={userIcon} alt="Logo"
                    onClick={handleUserIconClick}
                />}
                className="dashboard-header"
            /> 
            <div className="tx-main-content">
                <div className="tx-content-area">
                    <div className="dashboard-top-row">
                        <div className="search-patient">
                            <div className="patients-inner-section">
                                <div className="large-text">Search Patient</div>
                                <input
                                    type="text"
                                    placeholder="Search Patient"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="patient-info-section">
                            <div className="patient-info-inner-container">
                                <div className="grid-item"></div>
                                <div className="grid-item">
                                    <div className="grid-item-2-inner">
                                        <div>DOB:</div>
                                        <div>PATIENT ID:</div>
                                    </div>
                                </div>
                                <div className="grid-item">
                                    <div className="patient-info-inner-buttons">
                                        <button className="purple-button">
                                            Create New Tx Plan
                                        </button>
                                        <button className="purple-outline-button">
                                            View Saved Tx Plans
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="dashboard-bottom-row">
                        <div className="all-patients-container">
                            <div className="patients-inner-section">
                                <div className="large-text">All Patients</div>
                                <button className="purple-button">New Patient</button>
                            </div>
                            {/* Going to add additional functionality to list all patients here */}
                        </div>
                        <div className="dashboard-bottom-inner-row">
                            <div className="large-text">Create New TX Plan</div>
                            <div className="create-treatment-plan-section">
                                <div className="create-treatment-plan-section-inner">
                                    <img src={PenIcon} alt="Edit" />
                                    <div className="large-text">What can I help you treatment plan today?</div>
                                    <TextField
                                        label="Input your text"
                                        multiline
                                        minRows={3}
                                        value={inputText}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={handleGetTreatmentPlanById} className="purple-button">
                                        Generate Treatment Plan
                                    </button>
                                </div>
                            </div>
                            <div className="treatment-plan-output-section">
                                <div className="treatment-plan-output-section-inner">                                  
                                    <TreatmentPlanOutput treatmentPlan={treatmentPlan} />
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;