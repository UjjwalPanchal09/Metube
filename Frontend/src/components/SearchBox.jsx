import React from 'react'
import MiniVideoListCard from './MiniVideoListCard'

function SearchBox({ videos }) {
  return (
    <div className='h-fit w-[90%] sm:w-[80%] md:w-[50%] bg-zinc-950 rounded-lg shadow-[0px_0px_20px_rgba(251,113,133,0.5)]'>
      <div className='flex flex-col gap-2 p-2'>
        {videos.length > 0 ? (
          videos.map((video) => (
            <MiniVideoListCard key={video._id} video={video} />
          ))
        ) : (
          <p className='text-center text-gray-400 font-semibold'>No results found</p>
        )}
      </div>
    </div>
  )
}

export default SearchBox
