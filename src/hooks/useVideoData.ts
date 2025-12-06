import { useState, useEffect } from 'react';
import type { VideoData } from '../types';

export function useVideoData() {
    const [videoData, setVideoData] = useState<VideoData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadVideos() {
            try {
                const response = await fetch('/videos-data.json');
                if (!response.ok) throw new Error('Error al cargar datos');
                const data = await response.json();
                setVideoData(data);
                setError(null);
            } catch (err) {
                console.error('Error cargando videos:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, []);

    return { videoData, loading, error };
}
