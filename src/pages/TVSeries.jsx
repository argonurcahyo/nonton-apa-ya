import React, { useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import ImageSlider from '../components/ImageSlider';
import Transitions from '../components/Transition';
import TVCard from '../components/TVCard';
import TVSeason from '../components/TVSeason';
import { GlobalContext } from '../context/GlobalState';

const TVSeries = () => {
  let { id } = useParams();
  let { tvWatched } = useContext(GlobalContext);
  const [tvDetail, setTvDetail] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTvDetails = async (id) => {
    try {
      setLoading(true);
      const fetchData = await tmdb.get(`tv/${id}`, {
        params: {
          append_to_response: "credits,keywords,images",
        }
      });
      setTvDetail(fetchData.data);
    } catch (error) {
      console.log(error);
      setTvDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async (id) => {
    try {
      const fetchData = await tmdb.get(`tv/${id}/recommendations`);
      setSimilar(fetchData.data.results);
    } catch (error) {
      console.log(error);
      setSimilar([]);
    }
  };

  useEffect(() => {
    fetchTvDetails(id);
    fetchSimilar(id);
    // Scroll to top when ID changes (e.g., clicking a similar TV show)
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (tvDetail?.name) {
      document.title = `${tvDetail.name} | NontonApaYa`;
    }
  }, [tvDetail]);

  if (loading) {
    return (
      <Transitions>
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading Series...</p>
        </main>
      </Transitions>
    );
  }

  if (!tvDetail) return null;

  // Derived Values
  const statusRaw = tvDetail.status?.toLowerCase() || '';
  const isReturning = statusRaw.includes('returning');
  const isCanceled = statusRaw.includes('canceled');
  const statusClean = tvDetail.status?.replace(/ Series/gi, "") || 'Unknown';

  const watchedCount = tvWatched.filter(tv => tv.tvId === id).length;
  const totalCount = tvDetail.number_of_episodes || 0;
  const progressPercent = totalCount > 0 ? Math.min((watchedCount / totalCount) * 100, 100) : 0;
  const ratingClass = (rating) => {
    if (rating >= 7) return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-400/30";
    if (rating >= 4) return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-400/30";
    return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-400/30";
  };

  return (
    <Transitions>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
        
        {/* 1. HERO BACKDROP SECTION */}
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-800">
          <img
            src={tvDetail.backdrop_path ? `${BASE_IMG_URL}${tvDetail.backdrop_path}` : NO_IMG_URL_LANDSCAPE}
            alt={tvDetail.name}
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient to blend image into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        {/* 2. MAIN CONTENT WRAPPER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32 md:-mt-56">
          
          {/* HEADER: Poster & Title Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            
            {/* Poster Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-48 sm:w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-slate-50 dark:ring-slate-900"
            >
              <img
                src={tvDetail.poster_path ? `${BASE_IMG_URL}${tvDetail.poster_path}` : NO_IMG_URL}
                alt={tvDetail.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Title & Meta */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 mt-4 md:mt-24 text-center md:text-left"
            >
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {tvDetail.name}
                </h1>
                <span className={`px-3 py-1 mt-2 text-xs uppercase font-bold tracking-widest rounded-lg shadow-sm border ${
                  isReturning ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  isCanceled ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                  'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                }`}>
                  <i className={`fa-solid ${isReturning ? 'fa-circle-check' : isCanceled ? 'fa-circle-xmark' : 'fa-circle'} mr-1.5`}></i>
                  {statusClean}
                </span>
              </div>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4">
                Series details, seasons, and episodes
              </p>

              {tvDetail.tagline && (
                <p className="text-lg md:text-xl text-emerald-600 dark:text-emerald-400 font-medium italic mb-6">
                  "{tvDetail.tagline}"
                </p>
              )}

              {/* Badges/Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                {tvDetail.vote_average > 0 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-lg ${ratingClass(tvDetail.vote_average)}`}>
                    <i className="fa-solid fa-star"></i>
                    <span>{tvDetail.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {tvDetail.first_air_date && (
                  <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold">
                    <i className="fa-regular fa-calendar text-emerald-500"></i>
                    <Moment format="YYYY">{tvDetail.first_air_date}</Moment>
                    {tvDetail.last_air_date && tvDetail.last_air_date !== tvDetail.first_air_date && (
                      <>
                        <span className="text-slate-400">-</span>
                        <Moment format="YYYY">{tvDetail.last_air_date}</Moment>
                      </>
                    )}
                  </div>
                )}
                {tvDetail.number_of_seasons > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold">
                    <i className="fa-solid fa-tv text-emerald-500"></i>
                    <span>{tvDetail.number_of_seasons} {tvDetail.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. 2-COLUMN LAYOUT (Main Content + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: Overview, Media, Seasons */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Overview */}
              {tvDetail.overview && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-align-left text-emerald-500"></i> Synopsis
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                    {tvDetail.overview}
                  </p>
                </motion.section>
              )}

              {/* Top Cast (Horizontal Scroll) */}
              {tvDetail.credits?.cast?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-users text-emerald-500"></i> Top Cast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    {tvDetail.credits.cast.slice(0, 15).map((c) => (
                      <Link key={c.id} to={`/actor/${c.id}`} target="_blank" className="flex flex-col w-32 flex-shrink-0 snap-start group">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md mb-3 relative">
                          <img
                            alt={c.name}
                            src={c.profile_path ? `${BASE_IMG_URL}${c.profile_path}` : NO_IMG_URL}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500 rounded-xl transition-colors"></div>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {c.character}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Images Slider */}
              {tvDetail.images?.backdrops?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-image text-emerald-500"></i> Images
                  </h3>
                  <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                    <ImageSlider images={tvDetail.images.backdrops.map(im => `${BASE_IMG_URL}${im.file_path}`)} />
                  </div>
                </motion.section>
              )}

              {/* Seasons */}
              {tvDetail.seasons?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group text-emerald-500"></i> Seasons
                  </h3>
                  <div className="space-y-4">
                    {tvDetail.seasons.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <TVSeason tvId={id} seasonId={s.season_number} />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar (Progress, Networks, Genres, Keywords) */}
            <div className="space-y-6">
              
              {/* Watch Progress Widget */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your Progress</h3>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{watchedCount} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ {totalCount} Episodes</span></span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-lime-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Networks */}
              {tvDetail.networks?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Available On</h3>
                  <div className="flex flex-wrap gap-3">
                    {tvDetail.networks.map((n) => (
                      <Link key={n.id} to={`/tv/network/${n.id}`}>
                        <div className="bg-white/95 p-2 rounded-xl shadow-md border border-slate-200 hover:scale-110 transition-transform cursor-pointer h-14 min-w-[3.5rem] flex items-center justify-center">
                          {n.logo_path ? (
                            <img
                              alt={n.name}
                              src={`${BASE_IMG_URL}${n.logo_path}`}
                              className="max-h-full max-w-[80px] object-contain"
                              title={n.name}
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-900">{n.name}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Genres */}
              {tvDetail.genres?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvDetail.genres.map((g) => (
                      <Link key={g.id} to={`/tv/genre/${g.id}`}>
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                          {g.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Keywords */}
              {tvDetail.keywords?.results?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvDetail.keywords.results.map((k) => (
                      <Link key={k.id} to={`/tv/keyword/${k.id}`}>
                        <span className="inline-block border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors uppercase tracking-wider">
                          {k.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* 4. SIMILAR TV SERIES (Bottom Full Width) */}
          {similar.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-sparkles text-emerald-500"></i> You Might Also Like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {similar.slice(0, 10).map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TVCard tv={t} index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </Transitions>
  );
};

export default TVSeries;