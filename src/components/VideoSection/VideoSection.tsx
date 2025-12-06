import { useRef, useEffect, useState } from 'react';
import type { Video } from '../../types';
import { VideoCard } from '../VideoCard/VideoCard';
import './VideoSection.css';

interface VideoSectionProps {
    section: string;
    videos: Video[];
    onVideoClick: (video: Video, section: string) => void;
}

export function VideoSection({ section, videos, onVideoClick }: VideoSectionProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [scrollPosition, setScrollPosition] = useState<'start' | 'middle' | 'end'>('start');

    useEffect(() => {
        const updateCarouselUI = () => {
            if (listRef.current) {
                const overflow = listRef.current.scrollWidth > listRef.current.clientWidth + 1;
                setHasOverflow(overflow);
            }
        };

        updateCarouselUI();
        window.addEventListener('resize', updateCarouselUI);

        return () => window.removeEventListener('resize', updateCarouselUI);
    }, [videos]);

    const handleScroll = () => {
        if (!listRef.current) return;

        const { scrollLeft, clientWidth, scrollWidth } = listRef.current;
        const atStart = scrollLeft <= 2;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;

        if (atStart) setScrollPosition('start');
        else if (atEnd) setScrollPosition('end');
        else setScrollPosition('middle');
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (!listRef.current) return;

        const scrollAmount = Math.max(listRef.current.clientWidth * 0.75, 260);
        listRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <h2 className="section-title">
                    {section}
                    <span className="video-count">
                        {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                    </span>
                </h2>
                {hasOverflow && (
                    <div className="section-actions">
                        <button
                            className="section-action-btn"
                            onClick={() => scrollCarousel('right')}
                        >
                            Ver más →
                        </button>
                    </div>
                )}
            </div>

            <div className="carousel-wrap">
                {hasOverflow && (
                    <button
                        className="carousel-btn left"
                        onClick={() => scrollCarousel('left')}
                    >
                        ‹
                    </button>
                )}

                {hasOverflow && (
                    <div
                        className="carousel-fade left"
                        style={{ opacity: scrollPosition === 'start' ? 0 : 1 }}
                    />
                )}

                <div
                    ref={listRef}
                    className="videos-list"
                    onScroll={handleScroll}
                >
                    {videos.map((video, index) => (
                        <VideoCard
                            key={`${video.path}-${index}`}
                            video={video}
                            section={section}
                            onClick={() => onVideoClick(video, section)}
                        />
                    ))}
                </div>

                {hasOverflow && (
                    <div
                        className="carousel-fade right"
                        style={{ opacity: scrollPosition === 'end' ? 0 : 1 }}
                    />
                )}

                {hasOverflow && (
                    <button
                        className="carousel-btn right"
                        onClick={() => scrollCarousel('right')}
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
}
