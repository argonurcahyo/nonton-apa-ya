import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from "../apis/tmdb";
import Modal from './Modal';
import TVDetail from './TVDetail';
import OriginCountry from './OriginCountry';
import LoadingCard from './LoadingCard';
import { GlobalContext } from '../context/GlobalState';
import { handleImageError } from "../utils/imageFallback";

const TVCard = forwardRef(({ tv }, ref) => {
  const { tvWatched } = useContext(GlobalContext);
  const [tvDetail, setTvDetail] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const imageLoaded = () => setLoading(false);

  const fetchTvDetails = async (id) => {
    try {
      const fetchedTvDetails = await tmdb.get(`tv/${id}`, {
        params: {
          append_to_response: "credits,keywords,images",
        }
      });
      setTvDetail(fetchedTvDetails.data);
    } catch (error) {
      console.log(error);
      setTvDetail(null);
    }
  };

  useEffect(() => {
    if (tv?.id) {
      fetchTvDetails(tv.id);
    }
  }, [tv]);

  // Derived Values for cleaner JSX
  const displayTitle = tvDetail?.name || tv?.name;
  const displayPoster = tvDetail?.poster_path || tv?.poster_path;
  const isReturning = tvDetail?.status?.toLowerCase().includes('returning');
  const statusText = tvDetail?.status?.replace(/ Series/gi, '');
  
  // Safe Progress Calculation
  const watchedEpisodes = tvWatched?.filter(t => parseInt(t?.tvId) === tv?.id)?.length || 0;
  const totalEpisodes = tvDetail?.number_of_episodes || 0;
  const progressPercent = totalEpisodes > 0 ? Math.min((watchedEpisodes / totalEpisodes) * 100, 100) : 0;

  return (
    <div ref={ref} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Card Container */}
        <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden transition-all duration-300">
          
          {/* Image & Overlay Container */}
          <div 
            onClick={handleOpenModal}
            className="relative aspect-[2/3] w-full cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-800"
          >
            {loading && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <LoadingCard />
              </div>
            )}
            
            <img
              src={displayPoster ? `${BASE_IMG_URL}${displayPoster}` : NO_IMG_URL}
              alt={displayTitle}
              onLoad={imageLoaded}
              onError={(e) => handleImageError(e, 'POSTER')}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 cursor-pointer ${
                loading ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-sm text-white h-14 w-14 flex items-center justify-center rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
                <i className="fa-solid fa-play ml-1 text-xl"></i>
              </div>
            </div>

            {/* Origin Country (Top Left) */}
            {tvDetail?.origin_country && !loading && (
              <div className="absolute top-3 left-3 z-30 pointer-events-none">
                <OriginCountry countries={tvDetail.origin_country} />
              </div>
            )}

            {/* Networks (Centered Overlay) */}
            {tvDetail?.networks?.length > 0 && !loading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {tvDetail.networks.slice(0, 2).map((network) => (
                  <div
                    key={network.id}
                    className="bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-xl border border-slate-200/50 transform scale-95 group-hover:scale-100 transition-all duration-300"
                  >
                    {network.logo_path ? (
                      <img
                        src={`${BASE_IMG_URL}${network.logo_path}`}
                        alt={network.name}
                        className="h-8 w-auto max-w-[100px] object-contain"
                        title={network.name}
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-center whitespace-nowrap px-2 max-w-[100px] text-slate-900 truncate">
                        {network.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Badges (Seasons & Status) */}
            {!loading && (
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-30 pointer-events-none">
                {/* Season Count */}
                {tvDetail?.number_of_seasons > 0 ? (
                  <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                    <i className="fa-solid fa-tv mr-1.5"></i>
                    {tvDetail.number_of_seasons} {tvDetail.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                  </div>
                ) : <div />} {/* Empty div to keep flex-between spacing */}

                {/* Status Badge */}
                {statusText && (
                  <div className={`backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm border border-white/10 ${
                    isReturning ? 'bg-emerald-500/90' : 'bg-slate-600/90'
                  }`}>
                    <i className={`fa-solid ${isReturning ? 'fa-circle-check' : 'fa-circle'} mr-1.5`}></i>
                    {statusText}
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar (Attached to bottom of image) */}
            {totalEpisodes > 0 && !loading && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/50 backdrop-blur-sm z-30">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Desktop Card Body - Hidden by default, visible on hover */}
          <div className="hidden md:absolute md:inset-0 md:flex md:flex-col md:justify-end md:bg-gradient-to-t md:from-slate-900/95 md:to-transparent md:p-4 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:pointer-events-none">
            <h3 
              title={displayTitle}
              className="text-base font-bold text-white mb-2 cursor-pointer line-clamp-2"
              onClick={handleOpenModal}
            >
              {displayTitle}
            </h3>

            <p className="text-xs text-gray-300 flex items-center gap-1.5">
              <i className="fa-solid fa-film text-xs"></i>
              {totalEpisodes > 0 ? `${totalEpisodes} Episodes` : 'TBA Episodes'}
            </p>
          </div>

          {/* Mobile Card Body - Always visible */}
          <div className="md:hidden p-3 flex flex-col flex-grow">
            <h3 
              title={displayTitle}
              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 cursor-pointer"
              onClick={handleOpenModal}
            >
              {displayTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-auto pt-1">
              <i className="fa-solid fa-film text-xs"></i>
              {totalEpisodes > 0 ? `${totalEpisodes} Episodes` : 'TBA Episodes'}
            </p>
          </div>
        </div>

        {/* Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          {tvDetail && <TVDetail tvDetail={tvDetail} />}
        </Modal>
      </motion.div>
    </div>
  );
});

export default TVCard;