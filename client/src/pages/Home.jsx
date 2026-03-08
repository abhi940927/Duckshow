import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';
import MovieRow from '../components/MovieRow';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import VideoModal from '../components/VideoModal';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const [playingMovie, setPlayingMovie] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('/api/movies');
                setMovies(res.data.movies);
            } catch (err) {
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();

        // Check for welcome notification flag
        if (localStorage.getItem('duckshow_just_logged_in') === 'true') {
            setShowWelcome(true);
            localStorage.removeItem('duckshow_just_logged_in');
        }
    }, []);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070707' }}>
            <div className="logo logo-font" style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🦆 LOADING...</div>
        </div>
    );

    const trending = movies.slice(0, 6);
    const original = movies.filter(m => m.type === 'Original');
    const series = movies.filter(m => m.type === 'Series');
    const action = movies.filter(m => m.genre === 'Action');

    const handlePlay = (movie) => {
        setPlayingMovie(movie);
    };

    return (
        <div className="home-page fade-in" style={{ paddingBottom: '100px' }}>
            {showWelcome && (
                <Notification 
                    message={`Welcome back, ${user?.name || 'Duck'}! 🦆 Ready for some popcorn?`} 
                    onClose={() => setShowWelcome(false)}
                />
            )}
            
            <HeroCarousel movies={movies} />
            
            <div className="content-sections" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <MovieRow title="TRENDING" movies={trending} onPlay={handlePlay} />
                <MovieRow title="DUCKSHOW ORIGINALS" movies={original} onPlay={handlePlay} />
                <MovieRow title="MUST WATCH SERIES" movies={series} onPlay={handlePlay} />
                <MovieRow title="ACTION PACKED" movies={action} onPlay={handlePlay} />
            </div>

            {playingMovie && (
                <VideoModal movie={playingMovie} onClose={() => setPlayingMovie(null)} />
            )}
        </div>
    );
};

export default Home;
