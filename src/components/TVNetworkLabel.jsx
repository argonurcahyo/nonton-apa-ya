import React from 'react'
// import { useEffect } from 'react';

const TVNetworkLabel = ({ networks }) => {
  const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

  // useEffect(() => {
  //   console.log(networks)
  // }, [networks])
  return (
    <div className="tv-network-label">
      {networks && networks.map((n, i) => (
        <div key={i} className='tv-network'>
          <img
            src={n.logo_path ? `${BASE_IMG_URL}${n.logo_path}` : ""}
            alt={n.name} />
        </div>
      ))}
    </div >
  )
}

export default TVNetworkLabel