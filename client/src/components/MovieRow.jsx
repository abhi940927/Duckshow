import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';

const MovieRow = ({ title, movies, onPlay }) => {
    const navigate = useNavigate();
    if (movies.length === 0) return null;

    const handleViewAll = () => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('series')) navigate('/series');
        else if (lowerTitle.includes('anime')) navigate('/anime');
        else navigate('/movies');
    };

    return (
        <div className="section" style={{ padding: '40px 48px' }}>
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="section-title logo-font" style={{ fontSize: '1.8rem', letterSpacing: '2px' }}>
                    {title} <span style={{ color: 'var(--yellow)' }}>NOW</span>
                </h2>
                <button 
                    onClick={handleViewAll}
                    className="section-more mono-font" 
                    style={{ color: 'var(--yellow)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'none', background: 'none', border: 'none' }}
                >
                    VIEW ALL <ChevronRight size={14} />
                </button>
            </div>
            
            <div className="cards-row" style={{ 
                display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' 
            }}>
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onPlay={onPlay} />
                ))}
            </div>
        </div>
    );
};

export default MovieRow;
