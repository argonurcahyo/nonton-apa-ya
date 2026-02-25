import React from 'react'
import { BASE_IMG_URL } from '../apis/tmdb';

const MovieNetworkLabel = ({ networks, className = "" }) => {
  if (!networks || networks.length === 0) return null;

  return (
    <div className={className || "flex items-center gap-2"}>
      {networks.map((n, i) => (
        <div key={i} className="w-5 h-5 rounded bg-white/90 backdrop-blur-sm p-1 shadow-sm">
          <img
            src={n.logo_path ? `${BASE_IMG_URL}${n.logo_path}` : ""}
            alt={n.name}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  )
}

export default MovieNetworkLabel