import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import './styles/GlobalStyles.css';

import CategoryPage from './pages/CategoryPage';
import MyList from './pages/MyList';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Footer from './components/Footer';
import { About, Privacy, Terms } from './pages/InfoPages';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <CustomCursor />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/series" element={<CategoryPage />} />
                            <Route path="/movies" element={<CategoryPage />} />
                            <Route path="/anime" element={<CategoryPage />} />
                            <Route path="/new-and-hot" element={<CategoryPage />} />
                            <Route path="/my-list" element={<MyList />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/payment" element={<Payment />} />
                            
                            {/* Informational Pages */}
                            <Route path="/about" element={<About />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />
                        </Route>
                        
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
