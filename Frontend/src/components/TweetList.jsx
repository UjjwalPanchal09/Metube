import React from 'react'
import TweetCard from './TweetCard';
import { useLocation } from 'react-router-dom'

function TweetList() {
  const location = useLocation();
  const tweets = location.state?.tweets || [];
  return (
    <div className='mt-4 flex mx-1 sm:mx-4'>
        <div>
            {tweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet}/>                
            ))}
        </div>
    </div>
  )
}

export default TweetList