import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = ({ movies }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const heroMovies = movies.filter(m => m.type === 'Original').slice(0, 3);

    useEffect(() => {
        if (heroMovies.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [heroMovies.length]);

    if (heroMovies.length === 0) return null;

    const movie = heroMovies[currentIndex];

    return (
        <div className="hero" style={{ height: '80vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 48px' }}>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={movie.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                >
                    <div className="hero-bg-base" style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 30%, var(--${movie.color}), #070707 70%)`, opacity: 0.3 }} />
                    <div className="hero-gradient" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #070707 20%, transparent 80%), linear-gradient(to top, #070707 0%, transparent 40%)' }} />
                </motion.div>
            </AnimatePresence>

            <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
                <motion.div 
                    key={`content-${movie.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="hero-badge" style={{ 
                        background: 'var(--yellow)', color: 'black', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '2px', marginBottom: '20px', display: 'inline-block' 
                    }}>
                        {movie.type}
                    </span>
                    <h1 className="hero-title logo-font" style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '20px' }}>
                        {movie.title}
                    </h1>
                    <div className="hero-meta mono-font" style={{ display: 'flex', gap: '15px', color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--yellow)', fontWeight: 'bold' }}>{movie.rating}</span>
                        <span>{movie.year}</span>
                        <span>{movie.runtime}</span>
                        <span>{movie.genre}</span>
                    </div>
                    <p className="hero-desc" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '30px' }}>
                        {movie.desc}
                    </p>
                    <div className="hero-actions" style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-play" style={{ background: 'var(--yellow)', color: 'black', padding: '12px 35px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Play size={20} fill="currentColor" /> Play
                        </button>
                        <button 
                            onClick={() => navigate('/movies')}
                            className="btn-info" 
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 25px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', cursor: 'none', border: 'none' }}
                        >
                            <Info size={20} /> More Info
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="hero-progress" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                <motion.div 
                    key={`progress-${movie.id}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 8, ease: 'linear' }}
                    style={{ height: '100%', background: 'var(--yellow)' }}
                />
            </div>
        </div>
    );
};

export default HeroCarousel;
