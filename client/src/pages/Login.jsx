import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
        dob: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Direct Login Flow (Step 1)
                const loginRes = await axios.post('/api/login', {
                    email: formData.email,
                    password: formData.password
                });
                if (loginRes.data.success && loginRes.data.requiresOtp) {
                    setRequiresOtp(true);
                }
            } else {
                // Registration Flow (Step 1)
                const dob = new Date(formData.dob);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

                if (age < 9) {
                    setError('You must be at least 9 years old.');
                    setLoading(false);
                    return;
                }

                const res = await axios.post('/api/register', {
                    name: formData.firstName,
                    email: formData.email,
                    password: formData.password,
                    age
                });

                if (res.data.success && res.data.requiresOtp) {
                    setRequiresOtp(true);
                }
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Account already exists. Please Sign In.');
                setIsLogin(true);
            } else if (err.response?.status === 401) {
                setError('Incorrect email or password.');
            } else {
                setError(err.response?.data?.error || 'Authentication failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/api/verify-otp', {
                email: formData.email,
                otp: otpCode
            });

            if (res.data.success) {
                localStorage.setItem('duckshow_just_logged_in', 'true');
                login(res.data.user);
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page fade-in" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1a1a1a, #070707)'
        }}>
            <div className="login-container" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '48px',
                background: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                border: '1px solid #282828'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="logo-font" style={{ color: 'var(--yellow)', fontSize: '2.5rem' }}>🦆 DUCKSHOW</h1>
                    {requiresOtp ? (
                        <>
                            <p style={{ fontSize: '1rem', color: 'white', marginTop: '16px', fontWeight: 'bold' }}>
                                Security Verification
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                                We've sent a 6-digit code to <strong style={{color: 'var(--yellow)'}}>{formData.email}</strong>
                            </p>
                        </>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start streaming.'}
                        </p>
                    )}
                </div>

                {error && <div style={{
                    background: 'rgba(229, 57, 53, 0.1)',
                    color: 'var(--red)',
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    marginBottom: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(229, 57, 53, 0.2)'
                }}>{error}</div>}

                {requiresOtp ? (
                    <form onSubmit={handleOtpSubmit}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <input 
                                type="text" 
                                name="otpCode" 
                                placeholder="• • • • • •"
                                maxLength="6"
                                required
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                style={{
                                    width: '100%', padding: '16px', background: '#222', border: '1px dashed var(--yellow)', 
                                    borderRadius: '8px', color: 'white', outline: 'none',
                                    fontSize: '2rem', textAlign: 'center', letterSpacing: '10px'
                                }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', background: 'var(--yellow)', color: 'var(--black)',
                                fontWeight: 'bold', fontSize: '1rem', borderRadius: '4px',
                                opacity: loading ? 0.7 : 1, transition: 'background 0.2s'
                            }}
                        >
                            {loading ? 'VERIFYING...' : 'CONFIRM LOGIN'}
                        </button>
                        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
                            <button 
                                type="button"
                                onClick={() => {
                                    setRequiresOtp(false);
                                    setOtpCode('');
                                    setError('');
                                }}
                                style={{ 
                                    background: 'none', border: 'none', color: '#888', 
                                    cursor: 'none', textDecoration: 'underline', padding: '0' 
                                }}
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: '16px' }}>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    placeholder="First Name"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '12px', background: '#222', border: '1px solid #333', 
                                        borderRadius: '4px', color: 'white', outline: 'none'
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: '16px' }}>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '12px', background: '#222', border: '1px solid #333', 
                                    borderRadius: '4px', color: 'white', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '12px', background: '#222', border: '1px solid #333', 
                                    borderRadius: '4px', color: 'white', outline: 'none'
                                }}
                            />
                        </div>
                        {!isLogin && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Date of Birth</label>
                                <input 
                                    type="date" 
                                    name="dob" 
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '12px', background: '#222', border: '1px solid #333', 
                                        borderRadius: '4px', color: 'white', outline: 'none'
                                    }}
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', background: 'var(--yellow)', color: 'var(--black)',
                                fontWeight: 'bold', fontSize: '1rem', borderRadius: '4px',
                                opacity: loading ? 0.7 : 1, transition: 'background 0.2s'
                            }}
                        >
                            {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
                        </button>
                        
                        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                            <span style={{ color: '#666' }}>
                                {isLogin ? "New to Duckshow? " : "Already have an account? "}
                            </span>
                            <button 
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                style={{ 
                                    background: 'none', border: 'none', color: 'var(--yellow)', 
                                    cursor: 'none', fontWeight: 'bold', padding: '0' 
                                }}
                            >
                                {isLogin ? "Join Now" : "Sign In"}
                            </button>
                        </div>

                        <p style={{ fontSize: '0.7rem', color: '#666', textAlign: 'center', marginTop: '20px' }}>
                            By proceeding, you agree to our Terms of Service.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
