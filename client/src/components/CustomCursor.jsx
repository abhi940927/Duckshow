import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const onMouseDown = () => setClicked(true);
        const onMouseUp = () => setClicked(false);
        
        const onMouseLeave = () => setIsVisible(false);
        const onMouseEnter = () => setIsVisible(true);

        const handleOver = (e) => {
            if (e.target.closest('a, button, [role="button"], .card')) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseover', handleOver);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseover', handleOver);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div 
            id="cursor"
            className={`${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                transition: 'transform 0.1s ease, width 0.2s, height 0.2s',
                backgroundColor: 'var(--yellow)',
                borderRadius: '50%',
                width: hovered ? '40px' : '18px',
                height: hovered ? '40px' : '18px',
                mixBlendMode: 'difference'
            }}
        />
    );
};

export default CustomCursor;
