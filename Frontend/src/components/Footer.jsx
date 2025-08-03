import React from 'react'

function Footer() {
  return (
    <div className='flex flex-col items-center bg-zinc-950 py-2 md:py-4'>
        <p className='flex-col text-white text-sm md:text-md'>
            <a className='hover:font-semibold' href="/TermsAndConditions">Terms of Service</a> | <a className='hover:font-semibold' href="/PrivacyPolicy">Privacy Policy</a>
        </p>
        <p className='text-gray-400 font-semibold text-xs'>© 2023 MeTube. All rights reserved.</p>
    </div>
  )
}

export default Footer