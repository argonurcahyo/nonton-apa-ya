import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import tmdb from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';
import Modal from "./Modal";
import TVEpisodeDetail from './TVEpisodeDetail';
import Moment from 'react-moment';

const TVEpisode = ({ tvId, seasonId, episodeId }) => {
  const { tvWatched, addEpisodeToWatched } = useContext(GlobalContext);
  const[tvEpisode, setTvEpisode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if watched (ensure safe access)
  const isWatched = tvWatched?.some((o) => o?.id === tvEpisode?.id);

  const fetchTvEpisode = async (tvId, seasonId, episodeId) => {
    try {
      setLoading(true);
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}/episode/${episodeId}`, {
        params: {
          append_to_response: "images"
        }
      });
      setTvEpisode(fetchData.data);
    } catch (error) {
      console.log(error);
      setTvEpisode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTvEpisode(tvId, seasonId, episodeId);
  }, [tvId, seasonId, episodeId]);

  const handleWatchButton = (e) => {
    e.stopPropagation(); // Prevent the modal from opening when clicking the button
    if (!tvEpisode) return;
    
    let episodeData = {
      tvId: String(tvId),
      seasonId: String(seasonId),
      episodeId: String(episodeId),
      id: tvEpisode.id
    };
    addEpisodeToWatched(episodeData);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Format SxxExx
  const formattedSeason = seasonId?.toString().padStart(2, "0");
  const formattedEpisode = episodeId?.toString().padStart(2, "0");

  if (loading) {
    return (
      <div className="w-full h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse mb-2"></div>
    );
  }

  if (!tvEpisode) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleOpenModal}
        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
      >
        {/* Action Button */}
        <div className="flex-shrink-0">
          {!isWatched ? (
            <button
              onClick={handleWatchButton}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 shadow-sm"
              title="Mark as Watched"
            >
              <i className="fa-solid fa-eye text-xs"></i>
            </button>
          ) : (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm cursor-default"
              title="Watched"
            >
              <i className="fa-solid fa-check text-xs"></i>
            </button>
          )}
        </div>

        {/* Episode Info */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex-shrink-0 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
              S{formattedSeason}E{formattedEpisode}
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {tvEpisode.name}
            </span>
          </div>

          {/* Air Date (Fades in on hover on desktop, always visible but muted on mobile) */}
          {tvEpisode.air_date && (
            <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-9 sm:pl-0">
              <Moment format="MMM D, YYYY">{tvEpisode.air_date}</Moment>
            </span>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <TVEpisodeDetail episode={tvEpisode} />
      </Modal>
    </>
  );
};

export default TVEpisode;