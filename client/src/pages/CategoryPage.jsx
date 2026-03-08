import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import VideoModal from '../components/VideoModal';

const CategoryPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingMovie, setPlayingMovie] = useState(null);
    const location = useLocation();

    // Map path to category
    const getCategoryInfo = () => {
        const path = location.pathname.replace('/', '');
        switch(path) {
            case 'series': return { title: 'Series', genre: null, type: 'Series' };
            case 'movies': return { title: 'Movies', genre: null, type: 'Movie' };
            case 'anime':  return { title: 'Anime', genre: 'Anime', type: null };
            case 'new-and-hot': return { title: 'New & Hot', genre: null, type: 'Original' };
            default: return { title: 'DUCKSHOW', genre: null, type: null };
        }
    };

    const info = getCategoryInfo();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let url = '/api/movies';
                const params = new URLSearchParams();
                if (info.genre) params.append('genre', info.genre);
                if (info.type)  params.append('type',  info.type);
                
                const res = await axios.get(`${url}?${params.toString()}`);
                setMovies(res.data.movies);
            } catch (err) {
                console.error('Error fetching category movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [location.pathname]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070707' }}>
            <div className="logo logo-font" style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>🦆 LOADING...</div>
        </div>
    );

    const handlePlay = (movie) => {
        setPlayingMovie(movie);
    };

    return (
        <div className="category-page container fade-in" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 className="logo-font" style={{ fontSize: '3rem', letterSpacing: '2px' }}>
                    {info.title.toUpperCase()} <span style={{ color: 'var(--yellow)' }}>DUCK</span>
                </h1>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Browse our curated collection of {info.title.toLowerCase()}.</p>
            </div>

            {movies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#555' }}>
                    <p>No content found in this category yet.</p>
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

            {playingMovie && (
                <VideoModal movie={playingMovie} onClose={() => setPlayingMovie(null)} />
            )}
        </div>
    );
};

export default CategoryPage;
