import { useMemo } from 'react';
import type { VideoData } from '../types';

export function useSearch(videoData: VideoData, searchTerm: string) {
    const filteredData = useMemo(() => {
        if (!searchTerm) return videoData;

        const term = searchTerm.toLowerCase();
        const filtered: VideoData = {};

        Object.entries(videoData).forEach(([section, videos]) => {
            const filteredVideos = videos.filter(
                (video) =>
                    video.name.toLowerCase().includes(term) ||
                    section.toLowerCase().includes(term)
            );

            if (filteredVideos.length > 0) {
                filtered[section] = filteredVideos;
            }
        });

        return filtered;
    }, [videoData, searchTerm]);

    const totalFound = useMemo(() => {
        return Object.values(filteredData).reduce(
            (sum, section) => sum + section.length,
            0
        );
    }, [filteredData]);

    return { filteredData, totalFound };
}
