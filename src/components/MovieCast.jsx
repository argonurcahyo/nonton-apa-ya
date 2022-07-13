import React from 'react'
import Actor from './Actor'

const MovieCast = (casts) => {
 return (
  <>
   <ul>
    {casts.map((cast, index) => (
     <li><Actor actor={cast} /></li>
    ))}

   </ul>
  </>

 )
}

export default MovieCast