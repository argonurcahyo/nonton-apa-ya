import React from 'react'
import { useEffect } from 'react';

const TVNetworkLabel = ({ network }) => {
 const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

 useEffect(() => {
  console.log(network)
 }, []);

 return (
  <div className="tv-network-label">
   <img
    src={network.logo_path ? `${BASE_IMG_URL}${network.logo_path}` : ""}
    alt={network.name} />
  </div >
 )
}

export default TVNetworkLabel