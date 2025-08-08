import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { createRoot } from 'react-dom/client';

interface VimeoPlayerProps {
  videoId: string | number;
}

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ videoId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      playerRef.current = new Player(containerRef.current, {
        id: videoId,
        responsive: true,
        start_time: 10,
        end_time: 12,
        loop: true,
      });

      // Set up event listeners
      playerRef.current.on('play', () => setIsPlaying(true));
      playerRef.current.on('pause', () => setIsPlaying(false));
      playerRef.current.on('timeupdate', ({ seconds }: { seconds: number }) => setCurrentTime(Math.floor(seconds)));

      return () => {
        playerRef.current?.destroy();
      };
    }
  }, [videoId]);

  const handlePlay = () => playerRef.current?.play();
  const handlePause = () => playerRef.current?.pause();
  const handleSeek = (time: number) => playerRef.current?.setCurrentTime(time);
  const handleLoadVideo = (newVideoId: number) => playerRef.current?.loadVideo({
    id: newVideoId,
    responsive: true,
    controls: false,
    autoplay: true,
  });

  return (
    <div className="vimeo-player-wrapper">
      <div ref={containerRef}></div>
      <div className="controls">
        <button onClick={handlePlay} disabled={isPlaying}>Play</button>
        <button onClick={handlePause} disabled={!isPlaying}>Pause</button>
        <button onClick={() => handleSeek(0)}>Seek to Start</button>
        <button onClick={() => handleSeek(30)}>Seek to 0:30</button>
        <button onClick={() => handleLoadVideo(76979871)}>Load Another Video</button>
        <div className="status">
          Current Time: {currentTime} seconds
          <br />
          Status: {isPlaying ? 'Playing' : 'Paused'}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="react-example">
      <h1>React Vimeo Player Wrapper</h1>
      <p>This example demonstrates wrapping the Vimeo Player in a React component with custom controls.</p>
      <VimeoPlayer videoId="19231868" />
    </div>
  );
};

export function initReactWrapperPage() {
  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <div id="react-root"></div>
    </div>
  `;

  const root = createRoot(document.getElementById('react-root')!);
  root.render(<App />);
}
