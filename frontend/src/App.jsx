// frontend/src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/home/Home.jsx";
import Forms from "./pages/lista/Lista.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LoginModal from "./components/auth/LoginModal.jsx";
import ProfileModal from "./components/auth/ProfileModal.jsx";
import { useState } from "react";

export default function App() {
    const {
      showLoginModal, setShowLoginModal,
      showProfileModal, setShowProfileModal,
      login
    } = useAuth();

    const [activePage, setActivePage] = useState('formularios');

    return (
        <>
            <Dashboard setActivePage={setActivePage}>
                <Routes>
                    <Route path="/" element={<Navigate to="/formularios" />} />
                    <Route path="/formularios" element={<Forms />} />
                    {/* A rota duplicada foi removida daqui */}
                </Routes>
            </Dashboard>

            {/* A lógica para mostrar os modais já está aqui e está correta */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={login}
                />
            )}

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
}