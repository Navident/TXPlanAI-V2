
import { TextField } from "@mui/material";
import './TreatmentPlanOutput.css'; 
import HeaderBar from "../Common/HeaderBar/HeaderBar";
import React, { useState, useEffect } from 'react';
import PenIcon from '../../assets/pen-icon.svg';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../ClientServices/apiService';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { useNavigate } from 'react-router-dom';
import TreatmentPlanConfiguration from "../TreatmentPlanConfiguration/TreatmentPlanConfiguration";
import { getCdtCodes, getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../Utils/helpers';
import RoundedButton from "../Common/RoundedButton/RoundedButton";

const TreatmentPlanOutput = () => {

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

                        <div className="patient-info-section rounded-box box-shadow">
                            <div className="patient-info-inner-container ">
                                <div className="grid-item"></div>
                                <div className="grid-item">
                                    <div className="grid-item-2-inner">
                                        <div>DOB:</div>
                                        <div>PATIENT ID:</div>
                                    </div>
                                </div>
                                <div className="grid-item">
                                    <div className="patient-info-inner-buttons">
                                        <RoundedButton
                                            text="Create New TX Plan"
                                            backgroundColor="#7777a1"
                                            textColor="white"
                                            border={false}
                                            width="fit-content"  
                                            className="purple-button-hover"
                                        />
                                        <RoundedButton
                                            text="View Saved TX Plans"
                                            backgroundColor="white"
                                            textColor="#7777a1"
                                            border={true}
                                            width="fit-content" 
                                            borderColor="#7777a1" 
                                            className="outline-button-hover"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="dashboard-bottom-row">
                        <div className="dashboard-bottom-inner-row">
                            <div className="large-text">Create New TX Plan</div>
                            <div className="create-treatment-plan-section rounded-box box-shadow">
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
                                    <RoundedButton
                                        text="Generate Treatment Plan"
                                        backgroundColor="#7777a1"
                                        textColor="white"
                                        border={false}
                                        width="fit-content"
                                        onClick={handleGenerateTreatmentPlan}
                                        className="purple-button-hover"
                                    />
                                </div>
                            </div>
                            <div className="treatment-plan-output-section rounded-box box-shadow">
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

export default TreatmentPlanOutput;