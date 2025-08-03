import React from 'react'
import PlaylistCard from './PlaylistCard';
import { useLocation } from 'react-router-dom'

function PlaylistList() {
    const location = useLocation();
    const playlists = location.state?.playlists || [];

  return (
    <div className='mt-4 flex justify-center'>
        <div className='flex flex-wrap gap-5 justify-center'>
            {playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist}/>                
            ))}
        </div>
    </div>
  )
}

export default PlaylistList