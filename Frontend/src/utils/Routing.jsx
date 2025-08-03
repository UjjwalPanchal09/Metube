import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Introductory from '../components/Introductory'
import Home from '../components/Home'
import Profile from '../components/Profile'
import VideoDetail from '../components/VideoDetail'
import PlaylistView from '../components/PlaylistView'
import VideoList from '../components/VideoList'
import PlaylistList from '../components/PlaylistList'
import TweetList from '../components/TweetList'
import MiniDashboard from '../components/MiniDashboard'
import SubscribedList from '../components/SubscribedList'
import PrivacyPolicy from '../components/PrivacyPolicy'
import TermsAndConditions from '../components/TermsAndConditions'
function Routing() {
  return (
    <Routes>
        <Route path='/' element={<Introductory />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Profile/:id' element={<Profile />} />     
        <Route path='/VideoDetail/:id' element={<VideoDetail />} />   
        <Route path='/PlaylistView/:id' element={<PlaylistView />} />   
        <Route path='/VideoList' element={<VideoList />} />
        <Route path='/PlaylistList' element={<PlaylistList/>} />
        <Route path='/TweetList' element={<TweetList/>} />
        <Route path='/MiniDashboard' element={<MiniDashboard/>} /> 
        <Route path='/SubscribedList' element={<SubscribedList/>} /> 
        <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
        <Route path='/TermsAndConditions' element={<TermsAndConditions />} />
    </Routes>
  )
}

export default Routing