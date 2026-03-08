import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'US';

    return (
        <>
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button 
                        className="mobile-menu-btn" 
                        style={{ display: 'none', background: 'none', border: 'none', color: 'white' }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    
                    <Link to="/home" className="nav-logo logo-font">
                        🦆 DUCKSHOW
                    </Link>
                    
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/series" onClick={() => setMobileMenuOpen(false)}>Series</NavLink>
                        <NavLink to="/movies" onClick={() => setMobileMenuOpen(false)}>Movies</NavLink>
                        <NavLink to="/anime" onClick={() => setMobileMenuOpen(false)}>Anime</NavLink>
                        <NavLink to="/new-and-hot" onClick={() => setMobileMenuOpen(false)}>New & Hot</NavLink>
                        <NavLink to="/my-list" onClick={() => setMobileMenuOpen(false)}>My List</NavLink>
                    </div>
                </div>

                <div className="nav-right-actions">
                    <button className="nav-icon-btn" onClick={() => setSearchOpen(true)}>
                        <Search size={20} />
                    </button>
                    <button className="nav-icon-btn" style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}><Bell size={20} /></button>
                    
                    <div className="profile-container" style={{ position: 'relative' }}>
                        <div 
                            className="nav-avatar" 
                            onMouseEnter={() => setDropdownOpen(true)}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {userInitials}
                        </div>

                        {dropdownOpen && (
                            <div 
                                className="profile-dropdown"
                                onMouseLeave={() => setDropdownOpen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '44px',
                                    right: 0,
                                    background: '#141414',
                                    border: '1px solid #282828',
                                    borderRadius: '4px',
                                    width: '220px',
                                    padding: '8px 0',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                    zIndex: 1000
                                }}
                            >
                                <div style={{ padding: '12px 16px', borderBottom: '1px solid #282828', marginBottom: '8px' }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#888', wordBreak: 'break-all' }}>{user?.email}</p>
                                </div>
                                
                                <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem' }}>
                                    <User size={16} /> Profile Details
                                </Link>
                                <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.85rem' }}>
                                    <Settings size={16} /> Settings
                                </Link>
                                
                                <button 
                                    onClick={() => { logout(); navigate('/login'); }}
                                    style={{ 
                                        width: '100%', textAlign: 'left', 
                                        display: 'flex', alignItems: 'center', gap: '10px', 
                                        padding: '10px 16px', fontSize: '0.85rem', color: 'var(--red)',
                                        borderTop: '1px solid #282828', marginTop: '8px'
                                    }}
                                >
                                    <LogOut size={16} /> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
