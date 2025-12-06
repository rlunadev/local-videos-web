import type { Video } from '../../types';
import './VideoCard.css';

interface VideoCardProps {
    video: Video;
    section: string;
    onClick: () => void;
}

export function VideoCard({ video, section, onClick }: VideoCardProps) {
    return (
        <div className="video-item" onClick={onClick}>
            <div className="video-thumb">
                <div style={{ fontSize: '0.85rem', opacity: 0.95 }}></div>
            </div>
            <div className="video-title" title={video.name}>
                {video.name}
            </div>
            <div className="video-sub">{section}</div>
        </div>
    );
}
