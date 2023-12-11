
import { TextField } from "@mui/material";
import './Dashboard.css'; 
import SideBar from "../SideBar/SideBar";
import HeaderBar from "../HeaderBar/HeaderBar"; 
import TreatmentPlanOutput from "../TreatmentPlanOutput/TreatmentPlanOutput";
import React, { useState, useEffect } from 'react';
import PenIcon from '../../assets/pen-icon.svg';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../ClientServices/apiService';

const Dashboard = () => {
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

    const parseInput = (input) => {
        const lines = input.split('\n');
        const visits = [];
        let description = '';
        let toothNumber = null;

        if (lines.length > 0) {
            // Extract the tooth number from the first line
            const toothNumberMatch = lines[0].match(/\d+/);
            toothNumber = toothNumberMatch ? parseInt(toothNumberMatch[0]) : null;
            // Extract the description to get procedure category name
            description = lines[0].replace(/#\d+\s*/, '').trim();
        }

        lines.forEach((line, index) => {
            // Add a visit for each line
            visits.push({
                description: `Visit ${index + 1}`, // Set visit description
                visitNumber: index + 1, // Increment visit number for each line
            });
        });

        return {
            toothNumber,
            description, // Set the procedure category name as description
            visits
        };
    };



    const handleGenerateTreatmentPlan = async () => {
        const parsedData = parseInput(inputText);
        console.log("Parsed Data:", parsedData);
        await generateTreatmentPlan(parsedData, setTreatmentPlanId);
    };

    useEffect(() => {
        if (treatmentPlanId) {
            console.log("Attempting to retrieve treatment plan now");
            getTreatmentPlanById(treatmentPlanId, setTreatmentPlan);
        }
    }, [treatmentPlanId]);

    const handleGetTreatmentPlanById = async () => {
        if (treatmentPlanId) {
            console.log("Attempting to retrieve treatment plan now");
            await getTreatmentPlanById(treatmentPlanId, setTreatmentPlan);
        } else {
            console.log("No treatment plan ID available.");
        }
    };


    return (
        <div className="dashboard-container">
            <HeaderBar /> 
            <div className="dashboard-main-content">
                <div className="dashboard-content-area">
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
                                        <button onClick={handleGetTreatmentPlanById} className="purple-outline-button">
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
                                <TreatmentPlanOutput treatmentPlan={treatmentPlan} />
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;