import React from 'react'

const OriginCountry = ({ countries }) => {
 return (
  <div className='flex gap-1'>
   {countries.map((c, i) => (
    <div key={i} className='w-6 h-5 overflow-hidden rounded-sm border border-white/20 shadow-sm flex-shrink-0'>
     <img
      className='w-full h-full object-cover'
      src={c ? `https://flagsapi.com/${c}/shiny/64.png` : ""}
      alt={c} />
    </div>
   ))}
  </div>
 )
}

export default OriginCountry