import { useEffect, useRef } from 'react';
import type { VideoProgress } from '../../types';
import './VideoPlayer.css';

interface VideoPlayerProps {
    isOpen: boolean;
    currentVideo: VideoProgress | null;
    videoUrl: string;
    canPlayNext: boolean;
    canPlayPrevious: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSaveProgress: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
}

export function VideoPlayer({
    isOpen,
    currentVideo,
    videoUrl,
    canPlayNext,
    canPlayPrevious,
    onClose,
    onNext,
    onPrevious,
    onSaveProgress,
    videoRef,
}: VideoPlayerProps) {
    const saveIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            // Save progress every 5 seconds while playing
            saveIntervalRef.current = setInterval(() => {
                onSaveProgress();
            }, 5000);
        };

        const handlePause = () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
                saveIntervalRef.current = null;
            }
            onSaveProgress();
        };

        const handleEnded = () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
                saveIntervalRef.current = null;
            }
            onNext();
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
        };
    }, [onNext, onSaveProgress, videoRef]);

    // Auto-play when video loads
    useEffect(() => {
        if (videoRef.current && videoUrl) {
            videoRef.current.play().catch((err) => {
                console.error('Error al reproducir:', err);
            });
        }
    }, [videoUrl, videoRef]);

    if (!isOpen) return null;

    return (
        <div className={`player-section ${isOpen ? 'active' : ''}`}>
            <div className="player-card">
                <div className="video-player">
                    <video ref={videoRef} controls src={videoUrl}>
                        Tu navegador no soporta video HTML5
                    </video>
                </div>
                <div className="player-meta">
                    <div className="player-title">
                        <div>{currentVideo?.name || 'Selecciona un video'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9fb2c9' }}>
                            {currentVideo?.section || 'Módulo'}
                        </div>
                    </div>
                    <div className="player-controls">
                        <button
                            className="nav-btn"
                            onClick={onPrevious}
                            disabled={!canPlayPrevious}
                            title="Video anterior"
                        >
                            ← Anterior
                        </button>
                        <button
                            className="nav-btn"
                            onClick={onNext}
                            disabled={!canPlayNext}
                            title="Siguiente video"
                        >
                            Siguiente →
                        </button>
                        <button className="close-btn" onClick={onClose} title="Cerrar reproductor">
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
