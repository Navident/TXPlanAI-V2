
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
import TreatmentPlanConfiguration from "../TreatmentPlanConfiguration/TreatmentPlanConfiguration";
import { getCdtCodes, getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../Utils/helpers';

const Dashboard = () => {

    const [inputText, setInputText] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState(null);
    const [treatmentPlanId, setTreatmentPlanId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cdtCodes, setCdtCodes] = useState([]);

    const navigate = useNavigate();

    const handleUserIconClick = () => {
        navigate("/DefaultProcedures"); // This will navigate to the DefaultProcedures page
    };
    useEffect(() => {
        getCdtCodes(setCdtCodes); // Fetch CDT codes when component mounts    
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Here I will Implement search functionality or pass the search query to the parent component
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    useEffect(() => {
        if (treatmentPlanId) {
            console.log("Attempting to retrieve treatment plan now");
            getTreatmentPlanById(treatmentPlanId, setTreatmentPlan);
        }
    }, [treatmentPlanId]);

    const handleGenerateTreatmentPlan = async () => {
        const inputParts = inputText.split(' ');
        const subcategory = inputParts.slice(1).join(' ');

        if (subcategory) {
            console.log(`Fetching treatment plans for subcategory: ${subcategory}`);
            await getTreatmentPlansBySubcategory(subcategory, (plans) => {
                if (plans && plans.length > 0) {
                    setTreatmentPlan(plans[0]); // Assuming we take the first plan
                } else {
                    // Handle case when no plans are returned
                    console.log(`No treatment plans found for subcategory: ${subcategory}`);
                }
            });
        }
    };

    // Local handler for adding a visit
    const handleAddVisit = (newVisit) => {
        if (treatmentPlan) {
            const updatedPlan = addVisitToTreatmentPlan([treatmentPlan], treatmentPlan.treatmentPlanId, newVisit);
            setTreatmentPlan(updatedPlan[0]);
        }
    };

    // Local handler for deleting a visit
    const onDeleteVisit = (deletedVisitId) => {
        if (treatmentPlan) {
            const updatedPlan = deleteVisitInTreatmentPlan([treatmentPlan], treatmentPlan.treatmentPlanId, deletedVisitId);
            setTreatmentPlan(updatedPlan[0]);
        }
    };

    // Local handler for updating visits
    const onUpdateVisitsInTreatmentPlan = (updatedVisits) => {
        if (treatmentPlan) {
            const updatedPlan = updateVisitsInTreatmentPlan([treatmentPlan], treatmentPlan.treatmentPlanId, updatedVisits);
            setTreatmentPlan(updatedPlan[0]);
        }
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
                                    <button onClick={handleGenerateTreatmentPlan} className="purple-button">
                                        Generate Treatment Plan
                                    </button>
                                </div>
                            </div>
                            <div className="treatment-plan-output-section">
                                <div className="treatment-plan-output-section-inner">
                                    {treatmentPlan && (
                                        <TreatmentPlanConfiguration
                                            treatmentPlan={treatmentPlan}
                                            cdtCodes={cdtCodes}
                                            onAddVisit={handleAddVisit}
                                            useImageIconColumn={false}
                                            hideToothNumber={false}
                                            onUpdateVisitsInTreatmentPlan={onUpdateVisitsInTreatmentPlan}
                                            onDeleteVisit={onDeleteVisit}
                                            showToothNumber={true}
                                        />
                                    )}
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