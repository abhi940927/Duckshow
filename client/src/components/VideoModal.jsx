import React, { useEffect, useRef } from 'react';

const VideoModal = ({ movie, onClose }) => {
    const videoRef = useRef(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Auto-play when opened
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!movie) return null;

    return (
        <div 
            className="video-modal-overlay" 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer' // hint that clicking outside closes it
            }}
        >
            <div 
                className="video-modal-container fade-in" 
                onClick={(e) => e.stopPropagation()} // Prevent clicks on video from closing modal
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '1200px',
                    aspectRatio: '16/9',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                    cursor: 'default'
                }}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'var(--yellow)'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = 'white'; }}
                >
                    ✕
                </button>

                {/* Movie Info Overlay (Top Left) */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '24px',
                    zIndex: 10,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    pointerEvents: 'none'
                }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {movie.emoji} {movie.title}
                    </h2>
                    <p style={{ color: '#ccc', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        {movie.year} • {movie.runtime} • {movie.rating}
                    </p>
                </div>

                {/* HTML5 Video Player */}
                <video
                    ref={videoRef}
                    src={movie.videoUrl}
                    controls
                    autoPlay
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    // Show a fallback poster if video fails/loads
                    poster={movie.poster}
                    controlsList="nodownload"
                >
                    Your browser does not support HTML5 video.
                </video>
            </div>
        </div>
    );
};

export default VideoModal;
