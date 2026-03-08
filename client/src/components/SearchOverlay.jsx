import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Search } from 'lucide-react';
import MovieCard from './MovieCard';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/movies?q=${query}`);
                setResults(res.data.movies);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    if (!isOpen) return null;

    const handlePlay = (movie) => {
        onClose();
        alert(`Playing: ${movie.title}`);
    };

    return (
        <div className="search-overlay fade-in" style={{
            position: 'fixed', inset: 0, background: 'rgba(7,7,7,0.98)', 
            zIndex: 2000, padding: '40px 48px', overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <Search size={28} color="var(--yellow)" />
                    <input 
                        type="text" 
                        placeholder="Titles, people, genres..." 
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            background: 'none', border: 'none', color: 'white', fontSize: '2rem', 
                            width: '100%', outline: 'none', fontFamily: 'inherit'
                        }}
                    />
                </div>
                <button onClick={onClose} style={{ color: 'white', opacity: 0.7 }}>
                    <X size={40} />
                </button>
            </div>

            {loading && <p style={{ color: 'var(--yellow)', textAlign: 'center' }}>Searching...</p>}

            {!loading && results.length > 0 && (
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '24px', marginTop: '40px' 
                }}>
                    {results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onPlay={handlePlay} />
                    ))}
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#555' }}>
                    <p>No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default SearchOverlay;
