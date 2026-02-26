import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { BASE_IMG_URL, NO_IMG_URL, NO_IMG_URL_LANDSCAPE } from "../apis/tmdb";
import { handleImageError } from "../utils/imageFallback";

const MovieDetail = ({ movieDetail, providers }) => {
  const [loading, setLoading] = useState(true);

  if (!movieDetail) return null;

  const crews = movieDetail?.credits?.crew || [];
  const countries = movieDetail?.production_countries ||[];
  const title = movieDetail?.title;
  const original_title = movieDetail?.original_title;
  const directors = crews.filter(c => c.job === "Director");

  const imageLoaded = () => setLoading(false);
  const ratingClass = (rating) => {
    if (rating >= 7) return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-400/30";
    if (rating >= 4) return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-400/30";
    return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-400/30";
  };

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
          alt={movieDetail.title}
          src={movieDetail.backdrop_path ? `${BASE_IMG_URL}${movieDetail.backdrop_path}` : NO_IMG_URL_LANDSCAPE}
          onLoad={imageLoaded}
          onError={(e) => handleImageError(e, 'BACKDROP')}
        />
        {/* Subtle gradient overlay to make text pop if it overlaps */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 sm:opacity-100" />
      </div>

      {/* 2. HEADER: Title & Quick Meta */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-1">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-1">
            <Link to={`/movie/${movieDetail.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {title}
            </Link>
          </h1>
          {title !== original_title && (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Original Title: {original_title}
            </p>
          )}

          {/* Tagline */}
          {movieDetail.tagline && (
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold italic">
              "{movieDetail.tagline}"
            </p>
          )}
        </div>

        {/* Quick Stats (Rating, Runtime, Date) */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-bold shrink-0">
          {movieDetail.vote_average > 0 && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${ratingClass(movieDetail.vote_average)}`}>
              <i className="fa-solid fa-star"></i>
              <span>{movieDetail.vote_average.toFixed(1)}</span>
            </div>
          )}
          {movieDetail.runtime > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
              <i className="fa-regular fa-clock"></i>
              <span>{movieDetail.runtime} min</span>
            </div>
          )}
          {movieDetail.release_date && (
            <Link to={`/movie/year/${new Date(movieDetail.release_date).getFullYear()}`}>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <i className="fa-regular fa-calendar"></i>
                <Moment format="YYYY">{movieDetail.release_date}</Moment>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-1">
        
        {/* LEFT COLUMN: Synopsis & Cast */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Overview */}
          {movieDetail.overview && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Synopsis</h3>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {movieDetail.overview}
              </p>
            </div>
          )}

          {/* Cast (Horizontal Scroll to save space) */}
          {movieDetail?.credits?.cast?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Top Cast</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {movieDetail.credits.cast.slice(0, 10).map((c) => (
                  <Link key={c.id} to={`/actor/${c.id}`} target="_blank" className="flex flex-col items-center w-20 flex-shrink-0 snap-start group">
                      <div className="w-16 h-16 mb-2 overflow-hidden rounded-full shadow-sm border-2 border-transparent group-hover:border-emerald-500 transition-all">
                      <img
                        className="w-full h-full object-cover bg-slate-200 dark:bg-slate-800"
                        alt={c.name}
                        src={c.profile_path ? `${BASE_IMG_URL}${c.profile_path}` : NO_IMG_URL}
                        onError={(e) => handleImageError(e, 'PROFILE')}
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
          
          {/* Watch Providers */}
          {providers?.flatrate && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Stream On</h3>
              <div className="flex gap-2 flex-wrap">
                {providers.flatrate.map((c, i) => (
                  <Link key={i} to={`/movie/network/${c.provider_id}`}>
                    <img
                      className="w-10 h-10 rounded-lg shadow-sm hover:scale-110 transition-transform"
                      alt={c.provider_name}
                      title={c.provider_name}
                      src={`${BASE_IMG_URL}${c.logo_path}`}
                      onError={(e) => handleImageError(e, 'NETWORK')}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Genres */}
          {movieDetail.genres?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movieDetail.genres.map((g, i) => (
                  <Link key={i} to={`/movie/genre/${g.id}`}>
                    <span className="inline-block bg-gradient-to-r from-emerald-600 to-lime-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:shadow-md hover:scale-105 transition-all">
                      {g.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Directors */}
          {directors.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Director</h3>
              <div className="flex flex-wrap gap-2">
                {directors.map((dir) => (
                  <Link key={dir.id} to={`/director/${dir.id}`} target="_blank">
                    <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-3 py-1.5 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {dir.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {movieDetail?.keywords?.keywords?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-1.5">
                {movieDetail.keywords.keywords.slice(0, 8).map((k, i) => (
                  <Link key={i} to={`/movie/keyword/${k.id}`}>
                    <span className="text-[10px] uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded-md transition-all inline-block">
                      {k.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Countries / Production */}
          {countries.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Production</h3>
              <div className="flex gap-2 flex-wrap items-center">
                {countries.map((c, i) => (
                  <Link key={i} to={`/movie/country/${c.iso_3166_1}`}>
                    <img
                      className="w-8 h-8 object-contain rounded-full shadow-sm bg-slate-100 dark:bg-slate-800 p-1 hover:scale-110 transition-transform"
                      src={c.iso_3166_1 ? `https://flagsapi.com/${c.iso_3166_1}/flat/64.png` : ""}
                      alt={c.name}
                      title={c.name}
                      onError={(e) => handleImageError(e, 'FLAG')}
                    />
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

export default MovieDetail;