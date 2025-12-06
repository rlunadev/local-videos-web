import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { VideoGrid } from './components/VideoGrid/VideoGrid';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { useVideoData } from './hooks/useVideoData';
import { useSearch } from './hooks/useSearch';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { videoData, loading, error } = useVideoData();
  const { filteredData } = useSearch(videoData, searchTerm);
  const {
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
  } = useVideoPlayer(videoData);

  // Restore last video progress on mount
  useEffect(() => {
    if (Object.keys(videoData).length > 0) {
      restoreProgress();
    }
  }, [videoData, restoreProgress]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="no-videos">
          <p>Error al cargar videos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <VideoGrid videoData={filteredData} onVideoClick={playVideo} />

      <VideoPlayer
        isOpen={isPlayerOpen}
        currentVideo={currentVideo}
        videoUrl={getVideoUrl()}
        canPlayNext={canPlayNext}
        canPlayPrevious={canPlayPrevious}
        onClose={closePlayer}
        onNext={playNext}
        onPrevious={playPrevious}
        onSaveProgress={saveProgress}
        videoRef={videoRef}
      />

      <div className="footer">
        <p>© 2024 - AWS Certified Cloud Practitioner | Reproductor Local</p>
      </div>
    </div>
  );
}

export default App;
