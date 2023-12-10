
import { TextField } from "@mui/material";
import './Dashboard.css'; 
import SideBar from "../SideBar/SideBar";
import HeaderBar from "../HeaderBar/HeaderBar"; 
import React, { useState } from 'react';
import PenIcon from '../../assets/pen-icon.svg';

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Here I will Implement search functionality or pass the search query to the parent component
    };
    const [inputText, setInputText] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState(null);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const generateTreatmentPlan = async () => {
        try {
            const response = await fetch('https://localhost:7089/api/TreatmentPlans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: inputText,
                    Visits: [] // Add an empty array or default values
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTreatmentPlan(data);
            } else {
                // Log more detailed error information
                const errorText = await response.text();
                console.error(`Failed to create treatment plan. Status: ${response.status}, ${response.statusText}, Response Body: ${errorText}`);
            }
        } catch (error) {
            if (error.name === 'TypeError') {
                console.error('Network error or CORS issue:', error.message);
            } else {
                console.error('Other error:', error.message);
            }
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
                                    <button onClick={generateTreatmentPlan} className="purple-button">
                                        Generate Treatment Plan
                                    </button>
                                </div>
                            </div>
                            <div className="treatment-plan-output-section">
                                <div className="treatment-plan-output-section-inner">
                                    <div className="large-text">Treatment Plan</div>
                                    {treatmentPlan && (
                                        <div>
                                            <p>Description: {treatmentPlan.description}</p>
                                            {treatmentPlan.Visits && treatmentPlan.Visits.length > 0 && (
                                                <div>
                                                    <h3>Visits:</h3>
                                                    {treatmentPlan.Visits.map(visit => (
                                                        <div key={visit.VisitId}>
                                                            <p>Visit {visit.visitNumber}: {visit.description}</p>
                                                            {visit.CdtCodes && visit.CdtCodes.map((cdtCode, cdtIndex) => (
                                                                <p key={cdtIndex}>CDT Code: {cdtCode.code}</p>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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