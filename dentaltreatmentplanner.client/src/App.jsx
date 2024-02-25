import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from "./Pages/Landing/Landing";
import Home from "./Pages/Dashboard/Home/Home";

import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import DefaultProcedures from "./Pages/Dashboard/DefaultProceduresManagement/DefaultProceduresManagement";
import CustomCdtCodes from "./Pages/Dashboard/CustomCdtCodes/CustomCdtCodes";
import FeeScheduling from "./Pages/Dashboard/FeeScheduling/feeScheduling";
import EditFacilityFeeScheduling from "./Pages/Dashboard/FeeScheduling/EditFacilityFeeScheduling/editFacilityFeeScheduling";
import ProceduresCustomizer from "./Pages/Dashboard/DefaultProceduresManagement/ProceduresCustomizer/ProceduresCustomizer";
import PatientManagementDashboard from './Pages/PatientManagementDashboard/PatientManagementDashboard';
import GenerateTreatmentPlan from './Pages/PatientManagementDashboard/GenerateTreatmentPlan/GenerateTreatmentPlan';
import CreateNewPatient from './Pages/PatientManagementDashboard/CreateNewPatient/CreateNewPatient';
import SavedPatientTxPlans from './Pages/PatientManagementDashboard/SavedPatientTxPlans/SavedPatientTxPlans';
import PatientTreatmentPlanCustomizer from './Pages/PatientTreatmentPlanCustomizer/PatientTreatmentPlanCustomizer';
import AllSavedPatientTxPlans from "./Pages/Dashboard/AllSavedPatientTxPlans/index";

import TreatmentPlanConfiguration from './Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration';
import { BusinessProvider } from './Contexts/BusinessContext/BusinessProvider';
import { SortProvider } from './Contexts/SortContext/SortProvider';
import TreatmentPlanProvider from './Contexts/TreatmentPlanContext/TreatmentPlanProvider';
import AlertWrapper from './Components/AlertWrapper/index';
import { Provider } from 'react-redux';
import { store } from './Redux/ReduxStore/store';

function App() {
    return (
        <BusinessProvider>
            <TreatmentPlanProvider>
                <SortProvider>
                    <Provider store={store}>
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
                            <Route path="customcdtCodes" element={<CustomCdtCodes />} />
                            <Route path="feescheduling" element={<FeeScheduling />}>
                                <Route path="edit/:payerId" element={<EditFacilityFeeScheduling />} />
                            </Route>
                            <Route path="all-saved-patient-tx-plans" element={<AllSavedPatientTxPlans />} />
                        </Route>

                        <Route path="/PatientManagementDashboard" element={<PatientManagementDashboard />}>
                            <Route index element={<GenerateTreatmentPlan />} />
                            <Route path="create-new-patient" element={<CreateNewPatient />} />
                            <Route path="saved-patient-tx-plans/:patientId" element={<SavedPatientTxPlans />} />
                        </Route>

                        <Route path="/customize-treatment-plan/:treatmentPlanId" element={<PatientTreatmentPlanCustomizer />} />
                    </Routes>
                    <AlertWrapper />
                        </div>
                    </Provider>
                </SortProvider>
            </TreatmentPlanProvider>
        </BusinessProvider>
    );
}

export default App;


