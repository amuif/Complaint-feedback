'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'video' | 'audio';
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

const mediaItems: MediaItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'Traffic Safety Tips',
    description: 'Learn essential traffic safety tips for pedestrians and drivers',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: '/placeholder.jpg',
  },
  {
    id: '2',
    type: 'video',
    title: 'How to Apply for Parking Permits',
    description: 'Step-by-step guide for applying for parking permits',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: '/placeholder.jpg',
  },
  {
    id: '3',
    type: 'audio',
    title: 'Traffic Management Updates',
    description: 'Latest updates on traffic management in Addis Ababa',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
  },
];

export default function IdleMediaPlayer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem>(mediaItems[0]);
  const [idleTime, setIdleTime] = useState(0);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleUserActivity = () => {
      setIdleTime(0);
      setIsVisible(false);
      if (mediaRef.current) {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };

    const startIdleTimer = () => {
      idleTimerRef.current = window.setInterval(() => {
        setIdleTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 300) {
            setIsVisible(true);
            setIsPlaying(false);
          }
          return newTime;
        });
      }, 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    startIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && mediaRef.current && isPlaying) {
      mediaRef.current.play().catch((error) => {
        console.error('Error playing media:', error);
        setIsPlaying(false);
      });
    }
  }, [isVisible, isPlaying]);

  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMediaEnded = () => {
    const currentIndex = mediaItems.findIndex((item) => item.id === currentMedia.id);
    const nextIndex = (currentIndex + 1) % mediaItems.length;
    setCurrentMedia(mediaItems[nextIndex]);
    if (mediaRef.current) {
      mediaRef.current.play();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 overflow-hidden bg-background/95 backdrop-blur-sm">
        <div className="relative">
          {currentMedia.type === 'video' && (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={currentMedia.url}
              poster={currentMedia.thumbnail}
              className="w-full aspect-video object-cover"
              onEnded={handleMediaEnded}
              muted={isMuted}
              preload="none"
            />
          )}
          {currentMedia.type === 'audio' && (
            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={currentMedia.url}
              onEnded={handleMediaEnded}
              muted={isMuted}
              preload="none"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-semibold">{currentMedia.title}</h3>
            <p className="text-white/80 text-sm">{currentMedia.description}</p>
          </div>
        </div>
        <div className="p-2 flex items-center justify-between bg-background/80">
          <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-primary">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleMute} className="text-primary">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
