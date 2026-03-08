import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldCheck, Smartphone, X } from 'lucide-react';

const Payment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleConfirmPayment = async () => {
        setLoading(true);
        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Call our existing subscription API
            await axios.post('/api/subscribe', { userId: user.id, plan: 'premium' });
            
            setSuccess(true);
            setTimeout(() => {
                navigate('/settings');
            }, 3000);
        } catch (err) {
            alert('Payment confirmation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="payment-page container fade-in" style={styles.page}>
                <div style={styles.successCard}>
                    <CheckCircle size={80} color="#00C853" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Successful Payment Done!</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Your account has been upgraded to Premium.</p>
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
                    <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Unlock 4K streaming and exclusive original content.</p>
                </div>

                <div style={styles.planBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--yellow)' }}>Pro Plan (1 Year)</h2>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹999</span>
                    </div>
                    <ul style={styles.featureList}>
                        <li><CheckCircle size={16} color="var(--yellow)" /> Ad-free unlimited streaming</li>
                        <li><CheckCircle size={16} color="var(--yellow)" /> 4K Ultra HD & Dolby Atmos</li>
                        <li><CheckCircle size={16} color="var(--yellow)" /> Download on 4 devices</li>
                    </ul>
                </div>

                <div style={styles.upiBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={styles.iconCircle}>
                            <Smartphone size={24} color="#fff" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Direct UPI Payment</p>
                            <h3 style={{ fontSize: '1.8rem', letterSpacing: '2px', color: '#fff' }}>+91 1234567890</h3>
                        </div>
                    </div>
                    <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        Please transfer the exact amount (₹999) to the number above using Google Pay, PhonePe, or Paytm.
                    </p>
                </div>

                <button 
                    onClick={handleConfirmPayment} 
                    disabled={loading}
                    style={{ ...styles.payButton, opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'VERIFYING PAYMENT...' : 'I HAVE COMPLETED THE PAYMENT'}
                </button>

                <p style={styles.secureText}>
                    <ShieldCheck size={16} /> Secure Payment Verification
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
        padding: '50px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    planBox: {
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: '#ccc'
    },
    upiBox: {
        background: 'linear-gradient(145deg, #111 0%, #0a0a0a 100%)',
        border: '1px dashed var(--yellow)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    iconCircle: {
        width: '50px',
        height: '50px',
        borderRadius: '25px',
        background: 'rgba(255, 214, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    payButton: {
        width: '100%',
        padding: '18px',
        background: 'var(--yellow)',
        color: '#000',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s, background 0.2s',
        marginBottom: '20px'
    },
    secureText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#666',
        fontSize: '0.85rem'
    },
    successCard: {
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid #00C853',
        borderRadius: '16px',
        padding: '60px',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(0, 200, 83, 0.2)'
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
