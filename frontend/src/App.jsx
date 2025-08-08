import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/home/Home.jsx";
import Forms from "./pages/lista/Lista.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LoginModal from "./components/auth/LoginModal.jsx";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const {
      showLoginModal, setShowLoginModal,
      login
    } = useAuth();

    const [activePage, setActivePage] = useState('formularios');

    return (
        <>
            <Dashboard setActivePage={setActivePage}>
                <Routes>
                    <Route path="/" element={<Navigate to="/formularios" />} />
                    <Route path="/formularios" element={<Forms />} />
                </Routes>
            </Dashboard>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={login}
                />
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
             />
        </>
    );
}