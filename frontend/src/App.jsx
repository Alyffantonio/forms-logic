import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/home/Home.jsx";
import Forms from "./pages/lista/Lista.jsx";

export default function App() {
    return (
        <Dashboard>
            <Routes>
                <Route path="/" element={<Navigate to="/formularios" />} />
                <Route path="/formularios" element={<Forms />} />
                {/*<Route path="/formularios/:formId" element={<FormularioDetail />} />*/}
            </Routes>
        </Dashboard>
    );
}