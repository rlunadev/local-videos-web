import type { VideoData, Video } from '../../types';
import { VideoSection } from '../VideoSection/VideoSection';
import './VideoGrid.css';

interface VideoGridProps {
    videoData: VideoData;
    onVideoClick: (video: Video, section: string) => void;
}

export function VideoGrid({ videoData, onVideoClick }: VideoGridProps) {
    const sections = Object.entries(videoData);

    if (sections.length === 0) {
        return (
            <div className="no-videos">
                <p>No se encontraron videos.</p>
                <p>Por favor, asegúrate de que los videos están en la carpeta correcta.</p>
            </div>
        );
    }

    return (
        <div className="videos-grid">
            {sections.map(([section, videos]) => (
                <VideoSection
                    key={section}
                    section={section}
                    videos={videos}
                    onVideoClick={onVideoClick}
                />
            ))}
        </div>
    );
}
