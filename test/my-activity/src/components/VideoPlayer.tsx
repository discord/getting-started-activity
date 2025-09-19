import { useSyncState } from '@robojs/sync'
import sync from 'config/plugins/robojs/sync'
import { useEffect, useRef, useState } from 'react'

import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';


export const VideoPlayer = ({videosrc, handleClose}) => {


    const [videoState, setVideoState] = useSyncState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isMuted: false,
        isFullScreen: false,
    }, ['video'])

    // const [videoVolume, setVolume] = useState(1)

    // const [isPlaying, setPlaying] = useSyncState(false, ['video'])
    
    const videoPlayer = useRef<HTMLVideoElement>(null)

    const togglePlay = () => {

        setVideoState((prev) => ({
            ...prev, isPlaying: !videoState.isPlaying
        }))

        // const video = videoPlayer.current;
        // if (!video) return;
        // if (video.paused) video.play();
        // else video.pause();
      };
    
    //   const handleVolumeChange = (e) => { 
    //     const new_volume = e.target.value
    //     const video = videoPlayer.current;
    //     if (!video) return;
    //     setVolume(video.volume)

    //   };

      const handlePause = () => {
        setVideoState((prev) => ({...prev, isPlaying: false}))
      }

      const handlePlay = () => {
        setVideoState((prev) => ({...prev, isPlaying: true}))
      }

    const handleTimeUpdate = () => {
        const video = videoPlayer.current
        if (!video) return

        const newTime = video.currentTime
        setVideoState((prev) => ({...prev, currentTime: newTime}))
    }
    

    const handleLoadedMetaData = () => {
        const video = videoPlayer.current
        if (!video) return;

        setVideoState((prev) => ({...prev, duration: video.duration}))
    }

    // const handleTimeSeek = () => {
    //     const video = videoPlayer.current
    //     if (!video) return;

    //     const newTime = video.currentTime
    //     setVideoState((prev) => ({
    //         ...prev, 
    //         currentTime: newTime,
    //         sync: true
    //     }))
    // }

    useEffect(() => {
        const video = videoPlayer.current;
        if (!video) return;

        if (videoState.isPlaying) {
            video.play()
        } 

        if (!videoState.isPlaying) {
            video.pause()
        }

        if (video && (video.currentTime - videoState.currentTime > -0.5)) {
            video.currentTime = videoState.currentTime;
        }

        
        // ifs

        // if (videoState.sync) {
        //     videoState.sync = false
        //     video.currentTime = videoState.currentTime
        // }

        // video.currentTime = videoState.currentTime
        // video.muted = videoState.isMuted
    
        // const handlePlay = () => setVideoState((s) => ({ ...s, isPlaying: true }));
        // const handlePause = () => setVideoState((s) => ({ ...s, isPlaying: false }));
        // const handleTimeUpdate = () =>
        //   setVideoState((s) => ({ ...s, currentTime: video.currentTime }));
        // const handleLoadedMetadata = () =>
        //   setVideoState((s) => ({ ...s, duration: video.duration }));
        // const handleVolumeChange = () =>
        //   setVideoState((s) => ({
        //     ...s,
        //     volume: video.volume,
        //     isMuted: video.muted,
        //   }));
    
        // // Add event listeners
        // video.addEventListener('play', handlePlay);
        // video.addEventListener('pause', handlePause);
        // video.addEventListener('timeupdate', handleTimeUpdate);
        // video.addEventListener('loadedmetadata', handleLoadedMetadata);
        // video.addEventListener('volumechange', handleVolumeChange);
    
        // // Set initial state
        // setVideoState({
        //   isPlaying: !video.paused,
        //   currentTime: video.currentTime,
        //   duration: video.duration || 0,
        //   volume: video.volume,
        //   isMuted: video.muted,
        // });
    
        // // Cleanup function
        // return () => {
        //   video.removeEventListener('play', handlePlay);
        //   video.removeEventListener('pause', handlePause);
        //   video.removeEventListener('timeupdate', handleTimeUpdate);
        //   video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        //   video.removeEventListener('volumechange', handleVolumeChange);
        // };
      }, [videoState]);

    return (
        <div className='container'>
            <video 
                ref={videoPlayer} 
                className="video" 
                src={videosrc}
                onLoadedMetadata={handleLoadedMetaData}
                onTimeUpdate={handleTimeUpdate}
                // onPause={handlePause}
                // onPlay={handlePlay}
                controls={true}
                />
            <br />
            {/* <div onClick={handleClose}>Close</div> */}

            <button onClick={togglePlay}>
                {videoState.isPlaying ? 'Pause' : 'Play'}
            </button>

            <div style={{ marginTop: '0.5rem' }}>
            Time: {videoState.currentTime.toFixed(1)} / {videoState.duration.toFixed(1)} seconds
            </div>
        </div>
    )
}