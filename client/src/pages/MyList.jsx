import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

const MyList = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            if (!user) return;
            try {
                // Get the user's movie title list
                const listRes = await axios.get(`/api/mylist/${user.id}`);
                const titles = listRes.data.mylist || [];

                if (titles.length > 0) {
                    // Fetch all movies and filter by titles
                    const allRes = await axios.get('/api/movies');
                    const filtered = allRes.data.movies.filter(m => titles.includes(m.title));
                    setMovies(filtered);
                }
            } catch (err) {
                console.error('Error fetching My List:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [user]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070707' }}>
            <div className="logo logo-font" style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🦆 LOADING LIST...</div>
        </div>
    );

    const handlePlay = (movie) => {
        alert(`Playing: ${movie.title}`);
    };

    return (
        <div className="my-list-page container fade-in" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 className="logo-font" style={{ fontSize: '3rem' }}>
                    MY <span style={{ color: 'var(--yellow)' }}>LIST</span>
                </h1>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Everything you've saved to watch later.</p>
            </div>

            {movies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#555' }}>
                    <p>Your list is empty. Start adding some movies!</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '24px' 
                }}>
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onPlay={handlePlay} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyList;
