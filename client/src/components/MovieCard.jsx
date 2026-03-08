import React from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, onPlay }) => {
    const { myList, toggleMyList } = useAuth();
    const inList = myList && myList.includes(movie.title);

    // Helper to get color class
    const getColorClass = (color) => `c-${color.toLowerCase()}`;

    return (
        <div className="card">
            <div 
                className={`card-thumb ${!movie.poster ? getColorClass(movie.color) : ''}`}
                style={movie.poster ? { backgroundImage: `url(${movie.poster})` } : {}}
            >
                {!movie.poster && <span className="card-emoji">{movie.emoji}</span>}
                
                <div className="card-overlay">
                    <div className="card-tags">
                        {movie.tags.map(tag => (
                            <span key={tag} className={`tag ${tag.startsWith('ORIGINAL') ? 't-y' : 't-o'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="card-info">
                        <div className="card-title">{movie.title}</div>
                        <div className="card-sub">{movie.year} • {movie.genre}</div>
                    </div>
                </div>
                <button className="card-list-btn" onClick={(e) => { e.stopPropagation(); toggleMyList(movie.title); }} title={inList ? "Remove from My List" : "Add to My List"}>
                    {inList ? <Check size={20} strokeWidth={3} /> : <Plus size={20} />}
                </button>
                <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); onPlay(movie); }}>
                    <Play size={20} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
