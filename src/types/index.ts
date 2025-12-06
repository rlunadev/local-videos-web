export interface Video {
    name: string;
    path: string;
}

export interface VideoWithSection extends Video {
    section: string;
}

export interface VideoData {
    [section: string]: Video[];
}

export interface VideoProgress {
    path: string;
    currentTime: number;
    section: string;
    name: string;
    timestamp: string;
}

export interface QueueItem {
    video: Video;
    section: string;
}
