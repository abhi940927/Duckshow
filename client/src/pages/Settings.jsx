import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, Trash2, Moon, Sun, Zap } from 'lucide-react';

const Settings = () => {
    const { user, logout } = useAuth();
    const [sub, setSub] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('duckshow_theme') || 'auto');

    useEffect(() => {
        const fetchSub = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`/api/subscription/${user.id}`);
                if (res.data.active) {
                    setSub(res.data);
                }
            } catch (err) {
                console.error('Error fetching subscription:', err);
            }
        };
        fetchSub();
    }, [user]);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('duckshow_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        // Dispatch event if needed, or rely on root theme application logic
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you absolutely sure? This cannot be undone.')) return;
        try {
            await axios.delete(`/api/users/${user.id}`);
            logout();
            window.location.replace('/login');
        } catch (err) {
            alert('Failed to delete account.');
        }
    };

    return (
        <div className="settings-page container fade-in" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '800px' }}>
            <h1 className="logo-font" style={{ fontSize: '3rem', marginBottom: '40px' }}>
                SETT<span style={{ color: 'var(--yellow)' }}>INGS</span>
            </h1>

            {/* Profile Section */}
            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    <User size={20} color="var(--yellow)" /> Profile Details
                </h3>
                <div style={{ background: '#111', padding: '24px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>NAME</p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>EMAIL</p>
                    <p style={{ fontSize: '1.1rem' }}>{user?.email}</p>
                </div>
            </section>

            {/* Plan Section */}
            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    <CreditCard size={20} color="var(--yellow)" /> Plan & Billing
                </h3>
                <div style={{ background: '#111', padding: '24px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: 'bold', color: sub ? 'var(--yellow)' : '#888' }}>
                            {sub ? `Duckshow ${sub.plan.toUpperCase()} ✦` : 'Basic (Free)'}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                            {sub ? `Next billing date: ${sub.nextBillingDate}` : 'Subscribe for more features.'}
                        </p>
                    </div>
                    {!sub && (
                        <button style={{ background: 'var(--yellow)', color: 'black', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold' }}>
                            UPGRADE
                        </button>
                    )}
                </div>
            </section>

            {/* Appearance Section */}
            <section style={{ marginBottom: '48px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    <Zap size={20} color="var(--yellow)" /> Appearance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {['auto', 'dark', 'light', 'special'].map(t => (
                        <button 
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            style={{ 
                                padding: '15px', background: theme === t ? 'var(--yellow)' : '#111', 
                                color: theme === t ? 'black' : 'white', borderRadius: '4px', textAlign: 'center',
                                transition: '0.2s'
                            }}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </section>

            {/* Danger Zone */}
            <section>
                <h3 style={{ color: 'var(--red)', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>Danger Zone</h3>
                <button 
                    onClick={handleDeleteAccount}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--red)', 
                        padding: '12px 20px', border: '1px solid var(--red)', borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    <Trash2 size={18} /> DELETE ACCOUNT
                </button>
            </section>
        </div>
    );
};

export default Settings;
