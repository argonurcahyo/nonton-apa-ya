import React, { useEffect, useState, forwardRef } from 'react'
import ProgressiveImage from 'react-progressive-graceful-image'
import tmdb, { BASE_IMG_URL } from "../apis/tmdb";
import Modal from './Modal';
import TVDetail from './TVDetail';
import OriginCountry from './OriginCountry';
import NetworkBadge from './TVNetworkLabel';

const TVCard = forwardRef(({ tv }, ref) => {
 const [tvDetail, setTvDetail] = useState("");
 const [openModal, setOpenModal] = useState(false);

 const onOpenModal = () => {
  console.log(tvDetail);
  setOpenModal(true);
 };
 const onCloseModal = () => setOpenModal(false);

 useEffect(() => {
  const tvId = tv.id;

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
  fetchTvDetails(tvId);
 }, [tv]);

 return (
  <div
   ref={ref}
   className="movie-card"
  >
   <div
    className="overlay"
    onClick={onOpenModal}
   />

   <Modal open={openModal} onClose={onCloseModal}>
    <TVDetail tvDetail={tvDetail} />
   </Modal>

   <ProgressiveImage
    src={tv.poster_path ? `${BASE_IMG_URL}${tv.poster_path}` : "https://placekitten.com/141/213"}
    placeholder="https://i.stack.imgur.com/h6viz.gif"
   >
    {(src, loading) => (
     <img
      style={{ opacity: loading ? 0.5 : 1 }}
      src={src}
      alt={`${tv.name}`}
     />
    )}
   </ProgressiveImage>

   {tvDetail?.origin_country &&
    (<OriginCountry countries={tvDetail?.origin_country} />
    )}
   {tvDetail?.networks && (
    <NetworkBadge networks={tvDetail?.networks} />
   )}

   <div className='card-season-count'>
    {tvDetail?.seasons?.length}
   </div>

  </div>
 )
})

export default TVCard;