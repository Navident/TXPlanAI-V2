import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../assets/search-icon.svg';
import { getTreatmentPlansByPatient } from '../../../ClientServices/apiService';
import { useParams } from 'react-router-dom';
import SavedPatientTxPlansTable from './SavedPatientTxPlansTable/SavedPatientTxPlansTable';
import RoundedButton from "../../Common/RoundedButton/RoundedButton";
import './SavedPatientTxPlans.css';
import useTreatmentPlan from '../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';


const SavedPatientTxPlans = () => {
    const [inputText, setInputText] = useState('');
    const { patientId } = useParams();
    const navigate = useNavigate();

    const {
        treatmentPlans,
        setTreatmentPlanId,
        setTreatmentPlans, 
    } = useTreatmentPlan();

    useEffect(() => {
        if (patientId) {
            fetchTreatmentPlans(patientId);
        }
    }, [patientId]);

    const handleOpenClick = (planId) => {
        // Set the selected treatment plan ID using the context
        setTreatmentPlanId(planId);

        // Navigate to the PatientTreatmentPlanCustomizer component
        navigate(`/PatientManagementDashboard/saved-patient-tx-plans/${patientId}/customize-treatment-plan/${planId}`);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value.toLowerCase());
    };

    const fetchTreatmentPlans = async (id) => {
        try {
            const plans = await getTreatmentPlansByPatient(id);
            setTreatmentPlans(plans || []);
        } catch (error) {
            console.error('Error fetching treatment plans:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-CA", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            hour12: true,
            minute: '2-digit'
        });
    };


    const headers = ["Date", "Treatment Plan ID", ""]; 

    // Update rows
    const rows = treatmentPlans.map((plan) => {
        const date = plan.createdAt ? formatDate(plan.createdAt) : "N/A";

        const buttons = (
            <div className="savedPatientsTxTableButtons">
                <RoundedButton
                    text="Open"
                    backgroundColor="#7777a1"
                    textColor="white"
                    border={false}
                    width="120px"
                    className="purple-button-hover"
                    onClick={() => handleOpenClick(plan.treatmentPlanId)}
                />
                <RoundedButton
                    text="Delete"
                    backgroundColor="white"
                    textColor="red"
                    border={true}
                    width="120px"
                    borderColor="#7777a1"
                   // onClick={handleLoginClick}
                    className="outline-button-hover"
                />
            </div>
        );
        return {
            data: [date, plan.treatmentPlanId, buttons]
        };
    });

    return (
            <div className="dashboard-bottom-inner-row">
                <div className="dashboard-right-side-row">
                    <div className="large-text">Saved Tx Plans</div>
                    <TextField
                        className="rounded-box"
                        placeholder="Search By Date"
                        value={inputText}
                        onChange={handleInputChange}
                        sx={{
                            width: '350px',
                            backgroundColor: 'white',
                            '& label.Mui-focused': {
                                color: '#7777a1',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0)',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#7777a1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#7777a1',
                                },
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={searchIcon} alt="Search" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="edit-procedures-container rounded-box box-shadow">
                    <div className="edit-procedures-inner">
                    <SavedPatientTxPlansTable headers={headers} rows={rows} />
                    <Outlet />
                    </div>
                </div>
                </div>
    );
};

export default SavedPatientTxPlans;