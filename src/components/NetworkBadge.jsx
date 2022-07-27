import React from 'react'
import { BASE_IMG_URL } from '../apis/tmdb';

const NetworkBadge = ({ networks }) => {
  return (
    <div className="tv-network-label">
      {networks && networks.map(n => (
        <div key={n.id} className='tv-network'>
          <img
            src={n.logo_path ? `${BASE_IMG_URL}${n.logo_path}` : ""}
            alt={n.name} />
        </div>
      ))}
    </div >
  )
}

export default NetworkBadge