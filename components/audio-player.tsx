import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState({
    isError: false,
    errorMessage: '',
    isLoading: true,
    duration: 0,
  });

  const fileExtension = audioUrl.split('.').pop()?.toLowerCase();

  const getMimeType = (ext?: string) => {
    switch (ext) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'webm':
        return 'audio/webm';
      default:
        return 'audio/*';
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setPlayerState((prev) => ({
        ...prev,
        duration: audioRef.current?.duration || 0,
        isLoading: false,
        isError: false,
      }));
    }
  };

  const handleError = () => {
    if (!audioRef.current) return;

    const error = audioRef.current.error;
    let errorMessage = 'Failed to load audio';

    if (error) {
      switch (error.code) {
        case 1:
          errorMessage = 'Audio loading aborted';
          break;
        case 2:
          errorMessage = 'Network error';
          break;
        case 3:
          errorMessage = 'Audio decoding error';
          break;
        case 4:
          errorMessage = `Unsupported audio format (${fileExtension})`;
          break;
      }
    }

    console.error('Audio playback error:', {
      errorCode: error?.code,
      errorMessage,
      audioUrl,
      mimeType: getMimeType(fileExtension),
      canPlay: audioRef.current.canPlayType(getMimeType(fileExtension)),
    });

    setPlayerState((prev) => ({
      ...prev,
      isError: true,
      errorMessage,
      isLoading: false,
    }));
  };

  return (
    <div className="audio-player-container space-y-2">
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={() => setPlayerState((prev) => ({ ...prev, isLoading: true }))}
        controls
        className="w-full "
        preload="metadata"
      >
        <source src={audioUrl} type={getMimeType(fileExtension)} />
        Your browser does not support the audio element.
      </audio>

      {playerState.isLoading && <p className="text-sm text-gray-500">Loading audio...</p>}

      {playerState.isError && (
        <div className="error-message text-sm text-red-500">
          <p>{playerState.errorMessage}</p>
          <p>URL: {audioUrl}</p>
          <p>Format: {fileExtension}</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
