import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

const Notification = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '40px',
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid var(--yellow)',
            borderRadius: '12px',
            padding: '16px 24px',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            animation: isVisible ? 'slideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)' : 'fadeOut 0.3s ease forwards',
            maxWidth: '350px'
        }}>
            <div style={{
                background: 'var(--yellow)',
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--black)'
            }}>
                <Bell size={18} fill="currentColor" />
            </div>
            
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4 }}>
                    {message}
                </p>
            </div>

            <button 
                onClick={handleClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'none',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <X size={16} />
            </button>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.95); }
                }
            `}</style>
        </div>
    );
};

export default Notification;
