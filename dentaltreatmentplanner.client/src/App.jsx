import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from "./Pages/Landing/Landing";
import Home from "./Pages/Dashboard/Home/Home";

import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import DefaultProcedures from "./Pages/Dashboard/DefaultProceduresManagement/DefaultProceduresManagement";
import CustomCdtCodes from "./Pages/Dashboard/CustomCdtCodes/CustomCdtCodes";
import AccountInfo from "./Pages/Dashboard/AccountInfo/index";

import ProceduresCustomizer from "./Pages/Dashboard/DefaultProceduresManagement/ProceduresCustomizer/ProceduresCustomizer";
import PatientManagementDashboard from './Pages/PatientManagementDashboard/PatientManagementDashboard';
import GenerateTreatmentPlan from './Pages/PatientManagementDashboard/GenerateTreatmentPlan/GenerateTreatmentPlan';
import CreateNewPatient from './Pages/PatientManagementDashboard/CreateNewPatient/CreateNewPatient';
import SavedPatientTxPlans from './Pages/PatientManagementDashboard/SavedPatientTxPlans/SavedPatientTxPlans';
import PatientTreatmentPlanCustomizer from './Pages/PatientTreatmentPlanCustomizer/PatientTreatmentPlanCustomizer';
import AllSavedPatientTxPlans from "./Pages/Dashboard/AllSavedPatientTxPlans/index";
import TreatmentPlanConfiguration from './Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration';
import AlertWrapper from './Components/AlertWrapper/index';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/ReduxStore/store';
import { PersistGate } from 'redux-persist/integration/react';
import { enableMapSet } from 'immer';
import SmartNotes from './Pages/PatientManagementDashboard/SmartNotes/index'; 

import FeeScheduling from "./Pages/Dashboard/FeeScheduling/feeScheduling";
import EditFacilityFeeScheduling from "./Pages/Dashboard/FeeScheduling/EditFacilityFeeScheduling/editFacilityFeeScheduling";

function App() {

    enableMapSet();
    return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
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
                                <Route path="accountinfo" element={<AccountInfo />} />
                                <Route path="all-saved-patient-tx-plans" element={<AllSavedPatientTxPlans />} />
                            </Route> 

                            <Route path="/PatientManagementDashboard" element={<PatientManagementDashboard />}>
                                <Route index element={<GenerateTreatmentPlan />} />
                                <Route path="create-new-patient" element={<CreateNewPatient />} />
                                <Route path="saved-patient-tx-plans/:patientId" element={<SavedPatientTxPlans />} />
                                <Route path="smart-notes" element={<SmartNotes />} />
                            </Route>


                            <Route path="/customize-treatment-plan/:treatmentPlanId" element={<PatientTreatmentPlanCustomizer />} />
                        </Routes>
                        <AlertWrapper />
                    </div>
                </PersistGate>
            </Provider>
    );

}

export default App;


