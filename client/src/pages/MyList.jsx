import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import VideoModal from '../components/VideoModal';

const MyList = () => {
    const { user, myList } = useAuth();
    const [allMovies, setAllMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingMovie, setPlayingMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('/api/movies');
                setAllMovies(res.data.movies);
            } catch (err) {
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const displayMovies = allMovies.filter(m => myList && myList.includes(m.title));

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070707' }}>
            <div className="logo logo-font" style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🦆 LOADING LIST...</div>
        </div>
    );

    const handlePlay = (movie) => {
        setPlayingMovie(movie);
    };

    return (
        <div className="my-list-page container fade-in" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 className="logo-font" style={{ fontSize: '3rem' }}>
                    MY <span style={{ color: 'var(--yellow)' }}>LIST</span>
                </h1>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Everything you've saved to watch later.</p>
            </div>

            {displayMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#555' }}>
                    <p>Your list is empty. Start adding some movies!</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '24px' 
                }}>
                    {displayMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onPlay={handlePlay} />
                    ))}
                </div>
            )}

            {playingMovie && (
                <VideoModal movie={playingMovie} onClose={() => setPlayingMovie(null)} />
            )}
        </div>
    );
};

export default MyList;
