import React from 'react'

const BASE_FLAG_URL = 'https://countryflagsapi.com/png/';

const OriginCountry = ({ countries }) => {
 return (
  <div className='countries-box'>
   {countries.map((c, i) => (
    <div key={i} className='country-flag'>
     <img
      src={c ? `${BASE_FLAG_URL}${c.toLowerCase()}` : ""}
      alt={c} />
    </div>
   ))}
  </div>


 )
}

export default OriginCountry