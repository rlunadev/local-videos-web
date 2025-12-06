/**
 * Encode video path for URL
 */
export function encodeVideoPath(path: string): string {
    return '/' + path.split('/').map(part => encodeURIComponent(part)).join('/');
}

/**
 * Format video duration from seconds
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate total videos from video data
 */
export function getTotalVideos(videoData: { [key: string]: any[] }): number {
    return Object.values(videoData).reduce((sum, section) => sum + section.length, 0);
}
