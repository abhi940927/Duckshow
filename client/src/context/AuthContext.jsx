import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Automatically attach JWT token to all outgoing requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('duckshow_jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('duckshow_jwt') || null);
    const [loading, setLoading] = useState(true);
    const [myList, setMyList] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = localStorage.getItem('duckshow_auth') === 'true';
            const savedToken = localStorage.getItem('duckshow_jwt');
            if (isAuth && savedToken) {
                const userData = {
                    id: localStorage.getItem('duckshow_user_id'),
                    name: localStorage.getItem('duckshow_user_name'),
                    email: localStorage.getItem('duckshow_user_email'),
                    age: localStorage.getItem('duckshow_user_age'),
                };
                setUser(userData);
                setToken(savedToken);
                try {
                    const listRes = await axios.get(`/api/mylist/${userData.id}`);
                    setMyList(listRes.data.mylist || []);
                } catch (e) {
                    console.error("Failed to load My List", e);
                }
            } else if (isAuth && !savedToken) {
                // If old session without JWT, clean up
                logout();
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (userData, jwtToken) => {
        const userId = userData._id || userData.id;
        localStorage.setItem('duckshow_auth', 'true');
        localStorage.setItem('duckshow_user_id', userId);
        localStorage.setItem('duckshow_user_name', userData.name);
        localStorage.setItem('duckshow_user_email', userData.email);
        localStorage.setItem('duckshow_user_age', userData.age);
        if (jwtToken) {
            localStorage.setItem('duckshow_jwt', jwtToken);
            setToken(jwtToken);
        }
        setUser({ ...userData, id: userId });
        
        try {
            const listRes = await axios.get(`/api/mylist/${userId}`);
            setMyList(listRes.data.mylist || []);
        } catch (e) {
            console.error("Failed to load My List on login", e);
        }
    };

    const toggleMyList = async (movieTitle) => {
        if (!user) return;
        try {
            if (myList.includes(movieTitle)) {
                const res = await axios.delete('/api/mylist', { data: { userId: user.id, movieTitle } });
                setMyList(res.data.mylist || []);
            } else {
                const res = await axios.post('/api/mylist', { userId: user.id, movieTitle });
                setMyList(res.data.mylist || []);
            }
        } catch (e) {
            console.error("Failed to toggle My List", e);
        }
    };

    const logout = () => {
        const keysToRemove = [
            'duckshow_auth', 'duckshow_jwt', 'duckshow_user_id',
            'duckshow_user_name', 'duckshow_user_email', 'duckshow_user_age',
            'duckshow_mylist', 'duckshow_subscription', 'duckshow_billing_date'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        setUser(null);
        setToken(null);
        setMyList([]);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, myList, toggleMyList }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

