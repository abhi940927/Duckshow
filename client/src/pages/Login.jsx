import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        emailOrPhone: '',
        password: '',
        dob: '',
        name: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    
    // Forgot Password State: 0=none, 1=otp approach, 2=info approach
    const [forgotStep, setForgotStep] = useState(0); 

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
        console.log('Frontend Submit Triggered. Form Data State:', formData);

        try {
            if (isLogin) {
                const loginRes = await axios.post('/api/login', {
                    emailOrPhone: formData.emailOrPhone,
                    password: formData.password
                });
                if (loginRes.data.success) {
                    localStorage.setItem('duckshow_just_logged_in', 'true');
                    login(loginRes.data.user);
                    navigate('/home');
                }
            } else {
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
                    emailOrPhone: formData.emailOrPhone,
                    password: formData.password,
                    age,
                    dob: formData.dob
                });

                if (res.data.success) {
                    localStorage.setItem('duckshow_just_logged_in', 'true');
                    login(res.data.user);
                    navigate('/home');
                }
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Account already exists. Please Sign In.');
                setIsLogin(true);
            } else if (err.response?.status === 401) {
                setError('Incorrect email/phone or password.');
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
                emailOrPhone: formData.emailOrPhone,
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

    // ----- Forgot Password Handlers -----
    const requestForgotOtp = async () => {
        if (!formData.emailOrPhone) return setError('Please enter your Email or Phone above first.');
        setLoading(true); setError('');
        try {
            await axios.post('/api/forgot-password-request-otp', { emailOrPhone: formData.emailOrPhone });
            setForgotStep(1); // Move to OTP verify step
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request OTP. Make sure your email/phone is registered.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotResetOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await axios.post('/api/reset-password-otp', {
                emailOrPhone: formData.emailOrPhone,
                otp: otpCode,
                newPassword: formData.newPassword
            });
            if (res.data.success) {
                alert('Password reset successfully! Please sign in.');
                setForgotStep(0); setIsLogin(true); setOtpCode(''); setFormData({...formData, newPassword: ''});
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotResetInfo = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await axios.post('/api/reset-password-info', {
                emailOrPhone: formData.emailOrPhone,
                name: formData.name,
                dob: formData.dob,
                newPassword: formData.newPassword
            });
            if (res.data.success) {
                alert('Password reset successfully! Please sign in.');
                setForgotStep(0); setIsLogin(true); setFormData({...formData, newPassword: '', name: '', dob: ''});
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const renderForgotForm = () => {
        if (forgotStep === 1) {
            // OTP Reset Form
            return (
                <form onSubmit={handleForgotResetOtp}>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>
                        OTP sent to {formData.emailOrPhone}. Enter it below with your new password.
                    </p>
                    <input type="text" name="otpCode" placeholder="6-digit OTP" required value={otpCode}
                           onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} maxLength="6"
                           style={inputStyle} />
                    <input type="password" name="newPassword" placeholder="New Password" required value={formData.newPassword}
                           onChange={handleChange} style={inputStyle} />
                    
                    <button type="submit" className="login-btn" disabled={loading} style={btnStyle}>
                        {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                    </button>
                    <button type="button" onClick={() => setForgotStep(0)} style={linkBtnStyle}>Back to Login</button>
                    <button type="button" onClick={() => setForgotStep(2)} style={{...linkBtnStyle, marginTop: '10px', color: 'var(--yellow)'}}>
                        Can't access OTP? Use Security Questions (DOB & Name)
                    </button>
                </form>
            );
        }
        if (forgotStep === 2) {
            // Info Reset Form
            return (
                <form onSubmit={handleForgotResetInfo}>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>
                        Account Recovery for <strong style={{color:'white'}}>{formData.emailOrPhone}</strong>.<br/>
                        Provide the exact Name and Date of Birth on your account.
                    </p>
                    <input type="text" name="name" placeholder="Exact Account Name" required value={formData.name}
                           onChange={handleChange} style={inputStyle} />
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Date of Birth on Account</label>
                        <input type="date" name="dob" required value={formData.dob}
                               onChange={handleChange} style={inputStyle} />
                    </div>
                    <input type="password" name="newPassword" placeholder="New Password" required value={formData.newPassword}
                           onChange={handleChange} style={inputStyle} />
                    
                    <button type="submit" className="login-btn" disabled={loading} style={btnStyle}>
                        {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                    </button>
                    <button type="button" onClick={() => setForgotStep(0)} style={linkBtnStyle}>Back to Login</button>
                </form>
            );
        }
        return null;
    };

    const inputStyle = { width: '100%', padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '4px', color: 'white', outline: 'none', marginBottom: '16px' };
    const btnStyle = { width: '100%', padding: '14px', background: 'var(--yellow)', color: 'var(--black)', fontWeight: 'bold', fontSize: '1rem', borderRadius: '4px', opacity: loading ? 0.7 : 1, transition: 'background 0.2s', border: 'none', cursor: 'pointer' };
    const linkBtnStyle = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', padding: '0', display: 'block', margin: '20px auto 0', fontSize: '0.85rem' };

    return (
        <div className="login-page fade-in" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a1a1a, #070707)' }}>
            <div className="login-container" style={{ width: '100%', maxWidth: '440px', padding: '48px', background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid #282828' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="logo-font" style={{ color: 'var(--yellow)', fontSize: '2.5rem' }}>🦆 DUCKSHOW</h1>
                    {requiresOtp ? (
                        <>
                            <p style={{ fontSize: '1rem', color: 'white', marginTop: '16px', fontWeight: 'bold' }}>Security Verification</p>
                            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                                We've sent a 6-digit code to <strong style={{color: 'var(--yellow)'}}>{formData.emailOrPhone}</strong>
                            </p>
                        </>
                    ) : forgotStep > 0 ? (
                        <p style={{ fontSize: '1.2rem', color: 'white', marginTop: '8px', fontWeight: 'bold' }}>Reset Password</p>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start streaming.'}
                        </p>
                    )}
                </div>

                {error && <div style={{ background: 'rgba(229, 57, 53, 0.1)', color: 'var(--red)', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(229, 57, 53, 0.2)' }}>{error}</div>}

                {requiresOtp ? (
                    <form onSubmit={handleOtpSubmit}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <input type="text" name="otpCode" placeholder="• • • • • •" maxLength="6" required value={otpCode}
                                   onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                   style={{ width: '100%', padding: '16px', background: '#222', border: '1px dashed var(--yellow)', borderRadius: '8px', color: 'white', outline: 'none', fontSize: '2rem', textAlign: 'center', letterSpacing: '10px' }} />
                        </div>
                        <button type="submit" className="login-btn" disabled={loading} style={btnStyle}>
                            {loading ? 'VERIFYING...' : 'CONFIRM LOGIN'}
                        </button>
                        <button type="button" onClick={() => { setRequiresOtp(false); setOtpCode(''); setError(''); }} style={linkBtnStyle}>Back to Login</button>
                    </form>
                ) : forgotStep > 0 ? (
                    renderForgotForm()
                ) : (
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} onInput={handleChange} style={inputStyle} />
                        )}
                        <input type="text" name="emailOrPhone" placeholder="Email or Phone Number" required value={formData.emailOrPhone} onChange={handleChange} onInput={handleChange} style={inputStyle} />
                        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} onInput={handleChange} style={inputStyle} />
                        
                        {!isLogin && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Date of Birth</label>
                                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} style={inputStyle} />
                            </div>
                        )}

                        <button type="submit" className="login-btn" disabled={loading} style={btnStyle}>
                            {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
                        </button>
                        
                        {isLogin && (
                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                <button type="button" onClick={requestForgotOtp} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}>
                                    Forgot Password?
                                </button>
                                <span style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginTop: '4px' }}>
                                    (Enter Email/Phone above first)
                                </span>
                            </div>
                        )}

                        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                            <span style={{ color: '#666' }}>{isLogin ? "New to Duckshow? " : "Already have an account? "}</span>
                            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setForgotStep(0); }} style={{ background: 'none', border: 'none', color: 'var(--yellow)', cursor: 'pointer', fontWeight: 'bold', padding: '0' }}>
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
