import './App.css';
import "./Components/SignUp/SignUp.css";
import { Routes, Route } from 'react-router-dom';
import Home from "./Components/Home/Home";
import SignUp from "./Components/SignUp/SignUp";
import Dashboard from "./Components/Dashboard/Dashboard";
import DefaultProcedures from "./Components/DefaultProcedures/DefaultProcedures";
import ProceduresCustomizer from "./Components/ProceduresCustomizer/ProceduresCustomizer";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/DefaultProcedures" element={<DefaultProcedures />} />
                <Route path="/ProceduresCustomizer/:subcategory" element={<ProceduresCustomizer />} />
            </Routes>
        </div>
    );
}

export default App;
