import React from 'react'
import { BASE_IMG_URL } from '../apis/tmdb';

const TVNetworkLabel = ({ networks }) => {
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