import './App.css';
import "./Components/SignUp/SignUp.css";
import { Routes, Route } from 'react-router-dom';
import Landing from "./Components/Landing/Landing";
import Home from "./Components/Dashboard/Home/Home";

import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import DefaultProcedures from "./Components/DefaultProceduresManagement/DefaultProceduresManagement";
import ProceduresCustomizer from "./Components/DefaultProceduresManagement/ProceduresCustomizer/ProceduresCustomizer";
import PatientManagementDashboard from './Components/PatientManagementDashboard/PatientManagementDashboard';
import GenerateTreatmentPlan from './Components/PatientManagementDashboard/GenerateTreatmentPlan/GenerateTreatmentPlan';
import CreateNewPatient from './Components/PatientManagementDashboard/CreateNewPatient/CreateNewPatient';
import SavedPatientTxPlans from './Components/PatientManagementDashboard/SavedPatientTxPlans/SavedPatientTxPlans';
import PatientTreatmentPlanCustomizer from './Components/PatientManagementDashboard/SavedPatientTxPlans/PatientTreatmentPlanCustomizer/PatientTreatmentPlanCustomizer';

import TreatmentPlanConfiguration from './Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration';
import { BusinessProvider } from './Contexts/BusinessContext/BusinessProvider';
import TreatmentPlanProvider from './Contexts/TreatmentPlanContext/TreatmentPlanProvider';


function App() {
    return (
        <BusinessProvider>
            <TreatmentPlanProvider> 
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />

                        <Route path="/dashboard" element={<Dashboard />}>
                            <Route index element={<Home />} />
                            <Route path="defaultprocedures" element={<DefaultProcedures />}>
                                <Route path="procedurescustomizer/:category/:subcategory" element={<ProceduresCustomizer />} />
                                <Route path="treatmentplanconfiguration" element={<TreatmentPlanConfiguration />} />
                            </Route>
                        </Route>

                        <Route path="/PatientManagementDashboard" element={<PatientManagementDashboard />}>
                            <Route index element={<GenerateTreatmentPlan />} />
                            <Route path="create-new-patient" element={<CreateNewPatient />} />
                            <Route path="saved-patient-tx-plans/:patientId" element={<SavedPatientTxPlans />}>
                                <Route path="customize-treatment-plan/:treatmentPlanId" element={<PatientTreatmentPlanCustomizer />} />
                            </Route>
                        </Route>
                    </Routes>
                </div>
            </TreatmentPlanProvider>
        </BusinessProvider>
    );
}

export default App;


