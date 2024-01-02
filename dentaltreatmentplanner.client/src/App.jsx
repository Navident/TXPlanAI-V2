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
import TreatmentPlanOutput from './Components/TreatmentPlanOutput/TreatmentPlanOutput';
import TreatmentPlanConfiguration from './Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration';


function App() {
    return (
        <div className="App">
            
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<Home />} />
                        <Route path="defaultprocedures" element={<DefaultProcedures />}>
                            <Route path="procedurescustomizer/:subcategory" element={<ProceduresCustomizer />}>
                                <Route path="treatmentplanconfiguration" element={<TreatmentPlanConfiguration />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/treatmentplanoutput" element={<TreatmentPlanOutput />} />
                </Routes>
        </div>
    );
}

export default App;
