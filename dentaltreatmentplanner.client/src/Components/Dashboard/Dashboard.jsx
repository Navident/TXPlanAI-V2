
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
    const [treatmentPlans, setTreatmentPlans] = useState([]);
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
        const lines = inputText.split('\n');
        const planPromises = lines.map(async line => {
            const inputParts = line.trim().split(' ');
            const subcategory = inputParts.slice(1).join(' ');

            if (subcategory) {
                console.log(`Fetching treatment plans for subcategory: ${subcategory}`);
                const plans = await getTreatmentPlansBySubcategory(subcategory);
                return plans && plans.length > 0 ? plans[0] : null;
            }
        });

        const newTreatmentPlans = (await Promise.all(planPromises)).filter(plan => plan !== null);
        setTreatmentPlans(newTreatmentPlans);
    };





    // Local handler for adding a visit
    const handleAddVisit = (treatmentPlanId, newVisit) => {
        const updatedPlans = addVisitToTreatmentPlan(treatmentPlans, treatmentPlanId, newVisit);
        setTreatmentPlans(updatedPlans);
    };


    // Local handler for deleting a visit
    const onDeleteVisit = (treatmentPlanId, deletedVisitId) => {
        const updatedPlans = deleteVisitInTreatmentPlan(treatmentPlans, treatmentPlanId, deletedVisitId);
        setTreatmentPlans(updatedPlans);
    };


    // Local handler for updating visits
    const onUpdateVisitsInTreatmentPlan = (treatmentPlanId, updatedVisits) => {
        const updatedPlans = updateVisitsInTreatmentPlan(treatmentPlans, treatmentPlanId, updatedVisits);
        setTreatmentPlans(updatedPlans);
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
                                        sx={{
                                            '& label.Mui-focused': {
                                                color: '#7777a1',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#7777a1',
                                                },
                                            },
                                        }}
                                    />

                                    <button onClick={handleGenerateTreatmentPlan} className="purple-button">
                                        Generate Treatment Plan
                                    </button>
                                </div>
                            </div>
                            <div className="treatment-plan-output-section">
                                <div className="treatment-plan-output-section-inner">
                                    <div className="large-text">Treatment Plan</div>
                                    {treatmentPlans.map((plan, index) => (
                                        <TreatmentPlanConfiguration
                                            key={`treatment-plan-${index}`}
                                            treatmentPlan={plan}
                                            cdtCodes={cdtCodes}
                                            onAddVisit={(newVisit) => handleAddVisit(plan.treatmentPlanId, newVisit)}
                                            onUpdateVisitsInTreatmentPlan={(updatedVisits) => onUpdateVisitsInTreatmentPlan(plan.treatmentPlanId, updatedVisits)}
                                            onDeleteVisit={(deletedVisitId) => onDeleteVisit(plan.treatmentPlanId, deletedVisitId)}
                                            showToothNumber={true}
                                        
                                        />
                                    ))}
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