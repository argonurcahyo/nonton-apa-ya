import React, { useEffect, useState, forwardRef } from 'react'
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from "../apis/tmdb";
import Modal from './Modal';
import TVDetail from './TVDetail';
import OriginCountry from './OriginCountry';
import NetworkBadge from './TVNetworkLabel';
import LoadingCard from './LoadingCard';

const TVCard = forwardRef(({ tv }, ref) => {
 const [tvDetail, setTvDetail] = useState("");
 const [openModal, setOpenModal] = useState(false);
 const [loading, setLoading] = useState(true);

 const handleOpenModal = () => {
  console.log(tvDetail);
  setOpenModal(true);
 };
 const handleCloseModal = () => setOpenModal(false);
 const imageLoaded = () => {
  setLoading(false)
 }

 const fetchTvDetails = async (id) => {
  try {
   const fetchedTvDetails = await tmdb.get(`tv/${id}`, {
    params: {
     append_to_response: "credits,keywords",
    }
   });
   setTvDetail(fetchedTvDetails.data);
  } catch (error) {
   console.log(error);
   setTvDetail("");
  }
 }

 useEffect(() => {
  fetchTvDetails(tv?.id);
 }, [tv]);

 return (
  <div
   ref={ref}
   className="movie-card"
  >
   <div
    className="overlay"
    onClick={handleOpenModal}
   />

   <Modal open={openModal} onClose={handleCloseModal}>
    <TVDetail tvDetail={tvDetail} />
   </Modal>

   <div style={{ display: loading ? "block" : "none" }}>
    <LoadingCard />
   </div>
   <div style={{ display: loading ? "none" : "block" }}>
    <img
     alt={tvDetail.name}
     src={tvDetail.poster_path ? `${BASE_IMG_URL}${tvDetail.poster_path}` : NO_IMG_URL}
     onLoad={imageLoaded}
    />
   </div>

   {tvDetail?.origin_country &&
    (<OriginCountry countries={tvDetail?.origin_country} />
    )}
   {tvDetail?.networks && (
    <NetworkBadge networks={tvDetail?.networks} />
   )}

   {tvDetail?.number_of_seasons > 1 &&
    <div className='card-season-count'>
     {tvDetail?.number_of_seasons}
    </div>
   }
  </div>
 )
})

export default TVCard;