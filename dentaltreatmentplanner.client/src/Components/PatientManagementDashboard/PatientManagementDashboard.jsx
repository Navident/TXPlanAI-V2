
import './PatientManagementDashboard.css'; 
import HeaderBar from "../Common/HeaderBar/HeaderBar";
import GoBack from "../Common/GoBack/GoBack";

import SearchPatient from "./SearchPatient/SearchPatient";
import CreateNewPatient from "./CreateNewPatient/CreateNewPatient";
import PatientTreatmentPlanCustomizer from "./SavedPatientTxPlans/PatientTreatmentPlanCustomizer/PatientTreatmentPlanCustomizer";

import PatientList from "./PatientList/PatientList";
import PatientInfoSection from "./PatientInfoSection/PatientInfoSection";
import logo from '../../assets/navident-logo.svg';
import { Outlet } from 'react-router-dom';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import backButton from '../../assets/back-button.svg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const PatientManagementDashboard = () => {
    const { businessName } = useBusiness();
    const location = useLocation();
    const navigate = useNavigate();
    // Check if the current path includes 'create-new-patient'
    const isCreatingNewPatient = location.pathname.includes('/PatientManagementDashboard/create-new-patient');
    const isCustomizingTreatmentPlan = location.pathname.includes('/customize-treatment-plan');
    const showGoBack = !location.pathname.includes('/create-new-patient');

    const handleBackClick = () => {
        navigate(-1); 
    };
    const handleLogoClick = () => {
        navigate('/'); 
    };

    return (
        <div className="tx-container">
            {isCreatingNewPatient ? (
                <HeaderBar
                    leftCornerElement={<img src={backButton} alt="Back" className="back-btn-arrow" onClick={handleBackClick} />}
                    rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                    centerLogo={true}
                />
            ) : (
                <HeaderBar
                    leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" onClick={handleLogoClick} />}
                    rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                    className="dashboard-header"
                />
            )}
            <div className="tx-main-content">
                <div className="tx-content-area">
                    
                    {showGoBack && (
                        <GoBack text="Back To Dashboard" customOnClick={() => navigate("/dashboard")} />
                    )}
                    {!isCreatingNewPatient && !isCustomizingTreatmentPlan && (
                        <div className="dashboard-top-row">
                            <SearchPatient />
                            <PatientInfoSection />
                        </div>
                    )}

                    {!isCreatingNewPatient && !isCustomizingTreatmentPlan ? (
                        <div className="dashboard-bottom-row">
                            <PatientList />
                            <Outlet /> 
                        </div>
                    ) : isCustomizingTreatmentPlan ? (
                        <PatientTreatmentPlanCustomizer /> 
                    ) : (
                    <CreateNewPatient /> 
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientManagementDashboard;