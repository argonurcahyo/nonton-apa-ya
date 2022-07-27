import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb, { BASE_IMG_URL } from '../apis/tmdb'
import Transitions from '../components/Transition'
import TVSeason from '../components/TVSeason'

const TVSeries = () => {
 let { id } = useParams()
 const [tvDetail, setTvDetail] = useState({})

 const fetchTvDetails = async (id) => {
  try {
   const fetchData = await tmdb.get(`tv/${id}`, {
    params: {
     append_to_response: "credits",
    }
   });
   setTvDetail(fetchData.data);
   console.log(fetchData.data)
  } catch (error) {
   console.log(error)
   setTvDetail("");
  }
 }

 useEffect(() => {
  fetchTvDetails(id);
 }, [id]);

 return (
  <Transitions>
   <div className="movie-page">
    <div className="container">
     {tvDetail && (
      <>
       <h2>
        {tvDetail.name}
       </h2>
       <img
        className="detail-backdrop"
        width="100%"
        src={`${BASE_IMG_URL}${tvDetail.backdrop_path}`}
        alt={tvDetail.name}
       />
       <div className='tv-overview' style={{ marginTop: '10px' }}>
        {tvDetail.overview}
       </div>
       <div>
        {tvDetail?.seasons?.map((s, i) => (
         <div key={i}>
          <TVSeason tvId={id} seasonId={s?.season_number} />
         </div>
        ))}

       </div>
      </>
     )}
    </div>
   </div>
  </Transitions>
 )
}

export default TVSeries