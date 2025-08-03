import React from 'react'
import VideoListCard from './VideoListCard';
import { useLocation } from 'react-router-dom'

function VideoList() {
  const location = useLocation();
  const videos = location.state?.videos || [];
  return (
    <div className='mt-4 flex'>
        <div>
            {videos.map((video) => (
                <VideoListCard key={video._id} video={video}/>                
            ))}
        </div>
    </div>
  )
}

export default VideoList