import { useState, useCallback, useRef } from 'react';
import type { Video, VideoData, VideoProgress, QueueItem } from '../types';
import { encodeVideoPath } from '../utils/videoHelpers';

const STORAGE_KEY = 'cloudpractitioner_lastVideo';

export function useVideoPlayer(videoData: VideoData) {
    const [currentVideo, setCurrentVideo] = useState<VideoProgress | null>(null);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [videoQueue, setVideoQueue] = useState<QueueItem[]>([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Build video queue starting from a specific video
    const buildVideoQueue = useCallback(
        (startSection: string, startVideo: Video) => {
            const queue: QueueItem[] = [];
            const sections = Object.keys(videoData).sort();
            let foundStart = false;

            sections.forEach((section) => {
                if (section === startSection) {
                    foundStart = true;
                    const videos = videoData[section];
                    const startIndex = videos.findIndex((v) => v.path === startVideo.path);

                    // Add from start video to end of section
                    for (let i = startIndex; i < videos.length; i++) {
                        queue.push({ video: videos[i], section });
                    }
                } else if (foundStart) {
                    // Add all videos from following sections
                    videoData[section].forEach((video) => {
                        queue.push({ video, section });
                    });
                }
            });

            setVideoQueue(queue);
            setCurrentQueueIndex(0);
        },
        [videoData]
    );

    // Play a specific video
    const playVideo = useCallback(
        (video: Video, section: string) => {
            const progress: VideoProgress = {
                path: video.path,
                currentTime: 0,
                section,
                name: video.name,
                timestamp: new Date().toISOString(),
            };

            setCurrentVideo(progress);
            setIsPlayerOpen(true);
            buildVideoQueue(section, video);

            // Scroll to top when player opens
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        },
        [buildVideoQueue]
    );

    // Play next video in queue
    const playNext = useCallback(() => {
        if (videoQueue.length === 0) return;

        const nextIndex = currentQueueIndex + 1;
        if (nextIndex >= videoQueue.length) {
            console.log('Se terminó la reproducción de todos los videos');
            return;
        }

        setCurrentQueueIndex(nextIndex);
        const nextItem = videoQueue[nextIndex];
        playVideo(nextItem.video, nextItem.section);
    }, [videoQueue, currentQueueIndex, playVideo]);

    // Play previous video in queue
    const playPrevious = useCallback(() => {
        if (videoQueue.length === 0 || currentQueueIndex <= 0) return;

        const prevIndex = currentQueueIndex - 1;
        setCurrentQueueIndex(prevIndex);
        const prevItem = videoQueue[prevIndex];
        playVideo(prevItem.video, prevItem.section);
    }, [videoQueue, currentQueueIndex, playVideo]);

    // Close player
    const closePlayer = useCallback(() => {
        setIsPlayerOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = useCallback(() => {
        if (!currentVideo || !videoRef.current) return;

        const progress: VideoProgress = {
            ...currentVideo,
            currentTime: videoRef.current.currentTime,
            timestamp: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }, [currentVideo]);

    // Restore last video progress
    const restoreProgress = useCallback(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            const progress: VideoProgress = JSON.parse(saved);

            // Find video in loaded data
            let foundVideo: Video | null = null;
            let foundSection: string | null = null;

            Object.entries(videoData).forEach(([section, videos]) => {
                const video = videos.find((v) => v.path === progress.path);
                if (video) {
                    foundVideo = video;
                    foundSection = section;
                }
            });

            if (foundVideo && foundSection) {
                playVideo(foundVideo, foundSection);

                // Restore playback position
                if (videoRef.current) {
                    videoRef.current.currentTime = progress.currentTime;
                }
            }
        } catch (error) {
            console.error('Error restaurando video:', error);
        }
    }, [videoData, playVideo]);

    // Get encoded video URL
    const getVideoUrl = useCallback(() => {
        if (!currentVideo) return '';
        return encodeVideoPath(currentVideo.path);
    }, [currentVideo]);

    const canPlayNext = currentQueueIndex < videoQueue.length - 1;
    const canPlayPrevious = currentQueueIndex > 0;

    return {
        currentVideo,
        isPlayerOpen,
        videoRef,
        playVideo,
        playNext,
        playPrevious,
        closePlayer,
        saveProgress,
        restoreProgress,
        getVideoUrl,
        canPlayNext,
        canPlayPrevious,
    };
}
