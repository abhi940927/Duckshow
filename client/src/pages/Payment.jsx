import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldCheck, CreditCard, X, AlertTriangle, Loader2 } from 'lucide-react';

const Payment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Handle return from PayPal redirect
    useEffect(() => {
        const orderToken = searchParams.get('token') || searchParams.get('orderId');
        const status = searchParams.get('status');

        if (status === 'cancelled') {
            setError('Payment was cancelled on PayPal.');
            return;
        }

        if (orderToken && (status === 'success' || !status)) {
            const capturePayment = async () => {
                setCapturing(true);
                setError('');
                try {
                    const res = await axios.post('/api/paypal/capture-order', {
                        orderId: orderToken
                    });

                    if (res.data.success) {
                        setSuccess(true);
                        setTimeout(() => {
                            navigate('/settings');
                        }, 3000);
                    }
                } catch (err) {
                    console.error('PayPal capture error:', err);
                    setError(err.response?.data?.error || 'Failed to capture PayPal payment.');
                } finally {
                    setCapturing(false);
                }
            };

            capturePayment();
        }
    }, [searchParams, navigate]);

    // Handle initiating PayPal Checkout redirect
    const handlePayWithPayPal = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/paypal/create-order', {
                plan: 'premium'
            });

            if (res.data.approveUrl) {
                // Redirect user to PayPal to approve payment and deduct amount
                window.location.href = res.data.approveUrl;
            } else {
                setError('Failed to obtain PayPal checkout URL.');
            }
        } catch (err) {
            console.error('PayPal initiation error:', err);
            const errMsg = err.response?.data?.error || 'Unable to connect to PayPal. Please check server configuration.';
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (capturing) {
        return (
            <div className="payment-page container fade-in" style={styles.page}>
                <div style={styles.processingCard}>
                    <Loader2 size={50} color="var(--yellow)" className="spinner" style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>Finalizing Payment with PayPal</h2>
                    <p style={{ color: '#aaa', fontSize: '1rem' }}>Verifying deduction and upgrading your subscription...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="payment-page container fade-in" style={styles.page}>
                <div style={styles.successCard}>
                    <CheckCircle size={80} color="#00C853" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Successful Payment Done!</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Your account has been upgraded to Premium via PayPal.</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '20px' }}>Redirecting to settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page container fade-in" style={styles.page}>
            <button onClick={() => navigate('/settings')} style={styles.closeButton}>
                <X size={24} />
            </button>

            <div className="payment-container" style={styles.container}>
                <div style={styles.header}>
                    <h1 className="logo-font" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        UPGRADE TO <span style={{ color: 'var(--yellow)' }}>PREMIUM</span>
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Unlock 4K Ultra HD streaming and exclusive Duckshow Originals.</p>
                </div>

                {error && (
                    <div style={styles.errorBanner}>
                        <AlertTriangle size={20} color="#ff5252" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: '#ffbaba' }}>{error}</span>
                    </div>
                )}

                <div style={styles.planBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--yellow)', margin: 0 }}>Pro Plan</h2>
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>1 Year Unlimited Access</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#fff' }}>₹2</span>
                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>($0.03 USD on PayPal)</span>
                        </div>
                    </div>
                    <ul style={styles.featureList}>
                        <li><CheckCircle size={16} color="var(--yellow)" /> Ad-free unlimited streaming on all devices</li>
                        <li><CheckCircle size={16} color="var(--yellow)" /> 4K Ultra HD & Dolby Atmos audio</li>
                        <li><CheckCircle size={16} color="var(--yellow)" /> Offline downloads & priority support</li>
                    </ul>
                </div>

                <div style={styles.paypalBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={styles.iconCircle}>
                            <CreditCard size={26} color="#0079C1" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Instant Checkout</p>
                            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '4px 0 0 0' }}>PayPal & Debit/Credit Card</h3>
                        </div>
                    </div>
                    <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                        You will be securely redirected to PayPal to complete your purchase. ₹2 (approx. $0.03 USD) will be deducted directly from your account.
                    </p>
                </div>

                <button 
                    onClick={handlePayWithPayPal} 
                    disabled={loading}
                    style={{ ...styles.payButton, opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> REDIRECTING TO PAYPAL...
                        </span>
                    ) : (
                        'PAY ₹2 WITH PAYPAL'
                    )}
                </button>

                <p style={styles.secureText}>
                    <ShieldCheck size={16} color="#00C853" /> Official PayPal 256-bit Encrypted Checkout
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        paddingTop: '120px',
        paddingBottom: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
    },
    container: {
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 214, 0, 0.2)',
        borderRadius: '16px',
        padding: '45px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        position: 'relative'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    errorBanner: {
        background: 'rgba(255, 82, 82, 0.15)',
        border: '1px solid #ff5252',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    planBox: {
        background: '#161616',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '15px 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#ccc',
        fontSize: '0.95rem'
    },
    paypalBox: {
        background: 'linear-gradient(145deg, #111 0%, #0d0d0d 100%)',
        border: '1px solid rgba(0, 121, 193, 0.4)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px'
    },
    iconCircle: {
        width: '46px',
        height: '46px',
        borderRadius: '23px',
        background: 'rgba(0, 121, 193, 0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    payButton: {
        width: '100%',
        padding: '16px',
        background: '#0070BA',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.05rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        letterSpacing: '1px',
        transition: 'all 0.2s',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0, 112, 186, 0.4)'
    },
    secureText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#777',
        fontSize: '0.85rem',
        margin: 0
    },
    processingCard: {
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid rgba(255, 214, 0, 0.3)',
        borderRadius: '16px',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '450px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
    },
    successCard: {
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid #00C853',
        borderRadius: '16px',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '480px',
        boxShadow: '0 0 40px rgba(0, 200, 83, 0.25)'
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        transition: 'color 0.2s'
    }
};

export default Payment;
