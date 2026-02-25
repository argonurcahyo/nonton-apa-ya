import React, { useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BASE_IMG_URL, NO_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';

const TVDetail = ({ tvDetail }) => {
  const [loading, setLoading] = useState(true);

  if (!tvDetail) return null;

  const imageLoaded = () => setLoading(false);

  // Derived Values
  const statusRaw = tvDetail.status?.toLowerCase() || '';
  const statusClean = tvDetail.status?.replace(/ Series/gi, "") || 'Unknown';
  const isReturning = statusRaw.includes('returning');
  const isCanceled = statusRaw.includes('canceled');

  return (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
        className="flex flex-col text-slate-900 dark:text-slate-100 pb-4"
    >
        {/* 1. HERO BACKDROP */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md mb-6">
          {loading && (
            <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-700" />
          )}
          <img
            className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
            alt={tvDetail.name}
            src={tvDetail.backdrop_path ? `${BASE_IMG_URL}${tvDetail.backdrop_path}` : NO_IMG_URL_LANDSCAPE}
            onLoad={imageLoaded}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 sm:opacity-100" />
        </div>

        {/* 2. HEADER: Title & Quick Meta */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-1">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-1">
          <Link to={`/tv/${tvDetail.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {tvDetail.name}
          </Link>
        </h1>

            {/* Tagline */}
            {tvDetail.tagline && (
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold italic mt-2">
                "{tvDetail.tagline}"
              </p>
            )}
          </div>

          {/* Quick Stats (Status, Seasons, Episodes) */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold shrink-0">
            {tvDetail.status && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                isReturning ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-400/30' :
                isCanceled ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-400/30' :
                'bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-400/30'
              }`}>
                <i className={`fa-solid ${isReturning ? 'fa-circle-check' : isCanceled ? 'fa-circle-xmark' : 'fa-circle'}`}></i>
                <span>{statusClean}</span>
              </div>
            )}
            {tvDetail.number_of_seasons > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-400/30">
                <i className="fa-solid fa-tv"></i>
                <span>{tvDetail.number_of_seasons} Season{tvDetail.number_of_seasons !== 1 ? 's' : ''}</span>
              </div>
            )}
            {tvDetail.number_of_episodes > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                <i className="fa-solid fa-film"></i>
                <span>{tvDetail.number_of_episodes} Episodes</span>
              </div>
            )}
          </div>
      </div>

        {/* 3. MAIN CONTENT: 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-1">
        
          {/* LEFT COLUMN: Synopsis & Cast */}
          <div className="md:col-span-2 space-y-8">
          
            {/* Overview */}
            {tvDetail.overview && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Synopsis</h3>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {tvDetail.overview}
                </p>
              </div>
            )}

            {/* Air Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">First Air Date</h3>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-emerald-500"></i>
                  {tvDetail.first_air_date ? <Moment format="MMM D, YYYY">{tvDetail.first_air_date}</Moment> : 'TBA'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Last Air Date</h3>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-emerald-500"></i>
                  {tvDetail.last_air_date ? <Moment format="MMM D, YYYY">{tvDetail.last_air_date}</Moment> : 'Present'}
                </p>
              </div>
          </div>

            {/* Cast (Horizontal Scroll) */}
            {tvDetail.credits?.cast?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                  {tvDetail.credits.cast.slice(0, 15).map((c) => (
                    <Link key={c.id} to={`/actor/${c.id}`} target="_blank" className="flex flex-col items-center w-20 flex-shrink-0 snap-start group">
                      <div className="w-16 h-16 mb-2 overflow-hidden rounded-full shadow-sm border-2 border-transparent group-hover:border-emerald-500 transition-all">
                        <img
                          className="w-full h-full object-cover bg-slate-200 dark:bg-slate-800"
                          alt={c.name}
                          src={c.profile_path ? `${BASE_IMG_URL}${c.profile_path}` : NO_IMG_URL} 
                        />
                      </div>
                      <p className="text-xs font-bold text-center leading-tight text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {c.character}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details & Metadata */}
          <div className="space-y-6">
          
            {/* Networks */}
            {tvDetail.networks?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Networks</h3>
                <div className="flex gap-2 flex-wrap">
                  {tvDetail.networks.map((n) => (
                    <Link key={n.id} to={`/tv/network/${n.id}`}>
                      {n.logo_path ? (
                        <img
                          className="h-10 object-contain rounded-lg shadow-sm hover:scale-110 transition-transform"
                          src={`${BASE_IMG_URL}${n.logo_path}`}
                          alt={n.name}
                          title={n.name}
                        />
                      ) : (
                        <span className="inline-block text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          {n.name}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Genres */}
            {tvDetail.genres?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {tvDetail.genres.map((g) => (
                    <Link key={g.id} to={`/tv/genre/${g.id}`}>
                      <span className="inline-block bg-gradient-to-r from-emerald-600 to-lime-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:shadow-md hover:scale-105 transition-all">
                        {g.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Origin Countries */}
            {tvDetail.origin_country?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Origin</h3>
                <div className="flex gap-2 flex-wrap items-center">
                  {tvDetail.origin_country.map((country, i) => (
                    <img
                      key={i}
                      className="w-8 h-8 object-contain rounded-full shadow-sm bg-slate-100 dark:bg-slate-800 p-1 hover:scale-110 transition-transform"
                      src={`https://flagsapi.com/${country}/flat/64.png`}
                      alt={country}
                      title={country}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {tvDetail.keywords?.results?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tvDetail.keywords.results.slice(0, 12).map((k) => (
                    <Link key={k.id} to={`/tv/keyword/${k.id}`}>
                      <span className="text-[10px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded-md transition-all inline-block">
                        {k.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {tvDetail.production_companies?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Production</h3>
                <div className="flex flex-col gap-2">
                  {tvDetail.production_companies.slice(0, 5).map((comp) => (
                    <Link key={comp.id} to={`/tv/company/${comp.id}`}>
                      <span className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        &copy; {comp.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

    </motion.div>
  );
};

export default TVDetail;