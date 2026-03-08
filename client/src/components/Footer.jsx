import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Instagram, Globe } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--black)',
            color: 'var(--muted)',
            padding: '80px 48px 40px',
            borderTop: '1px solid #1e1e1e',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px'
            }}>
                {/* Brand & Social */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Link to="/home" className="logo logo-font" style={{ fontSize: '1.8rem', color: 'var(--yellow)' }}>
                        🦆 DUCKSHOW
                    </Link>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        The ultimate streaming experience for elite ducks and their friends. 
                        Watch original series, movies, and more.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="https://www.linkedin.com/in/abhinav-singh-124791322/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--white)', opacity: 0.7 }}>
                            <Linkedin size={20} />
                        </a>
                        <a href="https://x.com/ABHINAV78339768" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--white)', opacity: 0.7 }}>
                            <Twitter size={20} />
                        </a>
                        <a href="https://www.instagram.com/aviiiiii_irl/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--white)', opacity: 0.7 }}>
                            <Instagram size={20} />
                        </a>
                        <a href="https://github.com/abhi940927" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--white)', opacity: 0.7 }}>
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ color: 'var(--white)', fontWeight: 700 }}>Company</h4>
                    <Link to="/about" style={{ fontSize: '0.85rem' }}>About Us</Link>
                    <Link to="/settings" style={{ fontSize: '0.85rem' }}>Account</Link>
                    <Link to="/my-list" style={{ fontSize: '0.85rem' }}>My List</Link>
                    <Link to="/payment" style={{ fontSize: '0.85rem' }}>Subscribe</Link>
                </div>

                {/* Legal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ color: 'var(--white)', fontWeight: 700 }}>Legal</h4>
                    <Link to="/privacy" style={{ fontSize: '0.85rem' }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ fontSize: '0.85rem' }}>Terms of Service</Link>
                    <Link to="/terms" style={{ fontSize: '0.85rem' }}>Cookie Preferences</Link>
                    <Link to="/about" style={{ fontSize: '0.85rem' }}>Corporate Information</Link>
                </div>

                {/* Developer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ color: 'var(--white)', fontWeight: 700 }}>Developer</h4>
                    <a href="https://www.linkedin.com/in/abhinav-singh-124791322/" target="_blank" rel="noopener noreferrer" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '0.85rem' 
                    }}>
                        <Linkedin size={16} /> Abhinav Singh
                    </a>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Globe size={16} /> Portfolio
                    </a>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '60px auto 0',
                paddingTop: '24px',
                borderTop: '1px solid #141414',
                fontSize: '0.75rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                <p>© {currentYear} DUCKSHOW Streaming Private Limited. Built with ❤️ for the pond.</p>
                <p style={{ opacity: 0.5 }}>Duckshow is a demonstration project and is not affiliated with any real streaming service.</p>
            </div>
        </footer>
    );
};

export default Footer;
