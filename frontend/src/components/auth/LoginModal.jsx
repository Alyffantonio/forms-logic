import React, { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function LoginModal({ onClose, onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState('login');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const handleAuth = async (event) => {
        event.preventDefault();
        setError('');

        const isLogin = activeTab === 'login';

        const payload = {
            username,
            password
        };
        console.log(isLogin,'usuario')
        if (isLogin !== 'login') {
            console.log(isLogin,'usuario')
            payload.password_confirm = passwordConfirm;
        }

        const endpoint = isLogin ? `${apiUrl}/api/v1/auth/login/` : `${apiUrl}/api/v1/auth/register/`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                onLoginSuccess(result);
                onClose();
            } else {
                setError(result.detail || 'Ocorreu um erro.');
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor.');
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setError('');
        setUsername('');
        setPassword('');
        setPasswordConfirm('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex border-b">
                    <button
                        onClick={() => switchTab('login')}
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'login' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchTab('cadastro')}
                        className={`flex-1 py-4 text-center font-semibold ${activeTab === 'cadastro' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                    >
                        Cadastro
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleAuth} className="space-y-4">
                        {activeTab === 'login' && (
                            <>
                                <div>
                                    <label htmlFor="login-username" className="block text-sm font-medium text-gray-700">Usuário</label>
                                    <input type="text" id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 p-2 w-full border rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="login-password"
                                           className="block text-sm font-medium text-gray-700">Senha</label>
                                    <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded-md" required />
                                </div>
                            </>
                        )}

                        {activeTab === 'cadastro' && (
                            <>
                                <div>
                                    <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">Usuário</label>
                                    <input type="text" id="register-username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 p-2 w-full border rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="register-password"
                                           className="block text-sm font-medium text-gray-700">Senha</label>
                                    <input type="password" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 p-2 w-full border rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="register-passwordConfirm" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                                    <input type="password" id="register-passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="mt-1 p-2 w-full border rounded-md" required />
                                </div>
                            </>
                        )}

                        {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

                        <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 mt-4">
                            {activeTab === 'login' ? 'Entrar' : 'Cadastrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}