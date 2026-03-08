import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = localStorage.getItem('duckshow_auth') === 'true';
            if (isAuth) {
                const userData = {
                    id: localStorage.getItem('duckshow_user_id'),
                    name: localStorage.getItem('duckshow_user_name'),
                    email: localStorage.getItem('duckshow_user_email'),
                    age: localStorage.getItem('duckshow_user_age'),
                };
                setUser(userData);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem('duckshow_auth', 'true');
        localStorage.setItem('duckshow_user_id', userData.id);
        localStorage.setItem('duckshow_user_name', userData.name);
        localStorage.setItem('duckshow_user_email', userData.email);
        localStorage.setItem('duckshow_user_age', userData.age);
        setUser(userData);
    };

    const logout = () => {
        const keysToRemove = [
            'duckshow_auth', 'duckshow_user_id',
            'duckshow_user_name', 'duckshow_user_email', 'duckshow_user_age',
            'duckshow_mylist', 'duckshow_subscription', 'duckshow_billing_date'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
