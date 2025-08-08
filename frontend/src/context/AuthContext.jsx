import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const login = (userData) => {
        setUser(userData.user);
        setToken(userData.token);
        localStorage.setItem('authToken', userData.token);
        setShowLoginModal(false);
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            try {
                await fetch(`${apiUrl}/api/v1/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${currentToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error("Erro ao fazer logout no servidor:", error);
            }
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
    };

    const requireAuth = (callback) => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
        } else {
            callback();
        }
    };

    const isLoggedIn = () => !!token;

    const value = {
        user,
        token,
        isLoggedIn,
        login,
        logout,
        requireAuth,
        showLoginModal,
        setShowLoginModal,
        showProfileModal,
        setShowProfileModal
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};