import React from 'react';

export const VideoList  = ({videos, onVideoSelect}) => {
    return (
        <ul className='video-list'>
            {videos.map((video) => (
                <li key={video.id} onClick={() => onVideoSelect(video.url)}>
                    {video.title}
                </li>
            ))}
        </ul>
    )
}