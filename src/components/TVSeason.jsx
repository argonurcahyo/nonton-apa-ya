import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import { GlobalContext } from '../context/GlobalState';
import ImageSlider from './ImageSlider';
import TVEpisode from './TVEpisode';

const TVSeason = ({ tvId, seasonId }) => {
  const { tvWatched } = useContext(GlobalContext);
  const [tvSeason, setTvSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTvSeason = async (tvId, seasonId) => {
    try {
      setLoading(true);
      const fetchData = await tmdb.get(`tv/${tvId}/season/${seasonId}`, {
        params: {
          append_to_response: "images"
        }
      });
      setTvSeason(fetchData.data);
    } catch (error) {
      console.log(error);
      setTvSeason(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTvSeason(tvId, seasonId);
  }, [tvId, seasonId]);

  if (loading) {
    return (
      <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse mb-6"></div>
    );
  }

  if (!tvSeason) return null;

  // Safe Progress Calculations
  const episodes = tvSeason.episodes ||[];
  const totalEpisodes = episodes.length;
  const watchedEpisodes = tvWatched?.filter(tv => tv.tvId === String(tvId) && tv.seasonId === String(seasonId))?.length || 0;
  const progressPercent = totalEpisodes > 0 ? Math.min((watchedEpisodes / totalEpisodes) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-5 md:p-6 mb-6 overflow-hidden"
    >
      {/* Header Row: Title & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {tvSeason.name}
        </h2>
        {totalEpisodes > 0 && (
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">{watchedEpisodes}</span> / {totalEpisodes} Episodes
          </div>
        )}
      </div>

      {/* Animated Progress Bar */}
      {totalEpisodes > 0 && (
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-600 to-lime-500 rounded-full"
          />
        </div>
      )}

      {/* 2-Column Grid for Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Image / Poster */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden shadow-md bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {tvSeason?.images?.posters?.length > 0 ? (
              <ImageSlider
                variant="poster"
                images={tvSeason.images.posters.map(im => `${BASE_IMG_URL}${im.file_path}`)}
              />
            ) : (
              <img
                className="w-full h-auto aspect-[2/3] object-cover"
                src={NO_IMG_URL_LANDSCAPE}
                alt="No poster available"
              />
            )}
          </div>
        </div>

        {/* Right Column: Overview & Episodes */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full">
          
          {/* Season Overview */}
          {tvSeason.overview && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Overview</h3>
              <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
                {tvSeason.overview}
              </p>
            </div>
          )}

          {/* Episode List (Scrollable) */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Episodes</h3>
            {totalEpisodes > 0 ? (
              <div className="flex-1 max-h-[20rem] md:max-h-[25rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent space-y-3">
                {episodes.map((e, i) => (
                  <TVEpisode
                    key={e.id || i}
                    tvId={tvId}
                    seasonId={seasonId}
                    episodeId={e.episode_number || (i + 1)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                No episode information available yet.
              </p>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default TVSeason;