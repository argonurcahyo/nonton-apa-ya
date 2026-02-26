import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL, BASE_FLAG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import CollectionCard from '../components/CollectionCard';
import ImageSlider from '../components/ImageSlider';
import VideoSlider from '../components/VideoSlider';
import Transitions from '../components/Transition';
import { handleImageError } from '../utils/imageFallback';

const Movie = () => {
  let { movieId } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const[loading, setLoading] = useState(true);

  const fetchMovieDetails = async (id) => {
    try {
      setLoading(true);
      const fetchedMovieDetails = await tmdb.get(`movie/${id}`, {
        params: {
          append_to_response: "credits,watch/providers,keywords,images,videos",
        }
      });
      setMovieDetail(fetchedMovieDetails.data);
    } catch (error) {
      console.log(error);
      setMovieDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails(movieId);
    // Scroll to top on load
    window.scrollTo(0, 0);
  },[movieId]);

  useEffect(() => {
    if (movieDetail?.title) {
      document.title = `${movieDetail.title} | NontonApaYa`;
    }
  }, [movieDetail]);

  if (loading) {
    return (
      <Transitions>
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading Movie...</p>
        </main>
      </Transitions>
    );
  }

  if (!movieDetail) return null;

  const directors = movieDetail.credits?.crew?.filter(c => c.job === "Director") || [];
  const providers = movieDetail["watch/providers"]?.results?.ID?.flatrate ||[];
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
            src={movieDetail.backdrop_path ? `${BASE_IMG_URL}${movieDetail.backdrop_path}` : NO_IMG_URL_LANDSCAPE}
            alt={movieDetail.title}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => handleImageError(e, 'BACKDROP')}
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
                src={movieDetail.poster_path ? `${BASE_IMG_URL}${movieDetail.poster_path}` : NO_IMG_URL}
                alt={movieDetail.title}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'POSTER')}
              />
            </motion.div>

            {/* Title & Meta */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 mt-4 md:mt-24 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
                {movieDetail.title}
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4">
                Movie details, cast, and media
              </p>
              
              {movieDetail.tagline && (
                <p className="text-lg md:text-xl text-emerald-600 dark:text-emerald-400 font-medium italic mb-6">
                  "{movieDetail.tagline}"
                </p>
              )}

              {/* Badges/Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                {movieDetail.vote_average > 0 && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-lg ${ratingClass(movieDetail.vote_average)}`}>
                    <i className="fa-solid fa-star"></i>
                    <span>{movieDetail.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {movieDetail.release_date && (
                  <Link to={`/movie/year/${new Date(movieDetail.release_date).getFullYear()}`}>
                    <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                      <i className="fa-regular fa-calendar text-emerald-500"></i>
                      <Moment format="MMM Do, YYYY">{movieDetail.release_date}</Moment>
                    </div>
                  </Link>
                )}
                {movieDetail.runtime > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold">
                    <i className="fa-regular fa-clock text-emerald-500"></i>
                    <span>{movieDetail.runtime} min</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movieDetail.genres?.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {movieDetail.genres.map((g) => (
                    <Link key={g.id} to={`/movie/genre/${g.id}`}>
                      <span className="inline-block bg-gradient-to-r from-emerald-600 to-lime-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform">
                        {g.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* 3. 2-COLUMN LAYOUT (Main Content + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: Overview, Cast, Media */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Overview */}
              {movieDetail.overview && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-align-left text-emerald-500"></i> Synopsis
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                    {movieDetail.overview}
                  </p>
                </motion.section>
              )}

              {/* Top Cast (Horizontal Scroll) */}
              {movieDetail.credits?.cast?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-users text-emerald-500"></i> Top Cast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    {movieDetail.credits.cast.slice(0, 15).map((c) => (
                      <Link key={c.id} to={`/actor/${c.id}`} target="_blank" className="flex flex-col w-32 flex-shrink-0 snap-start group">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md mb-3 relative">
                          <img
                            alt={c.name}
                            src={c.profile_path ? `${BASE_IMG_URL}${c.profile_path}` : NO_IMG_URL}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => handleImageError(e, 'PROFILE')}
                          />
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500 rounded-xl transition-colors"></div>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {c.character}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Videos */}
              {movieDetail.videos?.results?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-play text-emerald-500"></i> Videos
                  </h3>
                  <VideoSlider videos={movieDetail.videos.results} />
                </motion.section>
              )}

              {/* Images Slider */}
              {movieDetail.images?.backdrops?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-image text-emerald-500"></i> Images
                  </h3>
                  <ImageSlider images={movieDetail.images.backdrops.map(im => `${BASE_IMG_URL}${im.file_path}`)} />
                </motion.section>
              )}

              {/* Collections */}
              {movieDetail.belongs_to_collection && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group text-emerald-500"></i> Part of a Collection
                  </h3>
                  <CollectionCard id={movieDetail.belongs_to_collection.id} />
                </motion.section>
              )}

            </div>

            {/* RIGHT COLUMN: Sidebar (Providers, Directors, Meta) */}
            <div className="space-y-6">
              
              {/* Watch Providers */}
              {providers.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Stream On</h3>
                  <div className="flex flex-wrap gap-3">
                    {providers.map((c, i) => (
                      <Link key={i} to={`/movie/network/${c.provider_id}`}>
                        <img
                          alt={c.provider_name}
                          src={`${BASE_IMG_URL}${c.logo_path}`}
                          className="w-14 h-14 rounded-xl shadow-md hover:scale-110 transition-transform cursor-pointer border border-slate-200 dark:border-slate-700"
                          title={c.provider_name}
                        />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Director */}
              {directors.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Directed by</h3>
                  <div className="flex flex-wrap gap-2">
                    {directors.map((dir) => (
                      <Link key={dir.id} to={`/director/${dir.id}`} target="_blank">
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                          {dir.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Production Countries */}
              {movieDetail.production_countries?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Production</h3>
                  <div className="flex flex-wrap gap-3 items-center">
                    {movieDetail.production_countries.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {c.iso_3166_1 && (
                          <img
                            src={`${BASE_FLAG_URL}${c.iso_3166_1}/flat/64.png`}
                            alt={c.name}
                            className="h-6 w-auto shadow-sm rounded-sm"
                            title={c.name}
                          />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Keywords */}
              {movieDetail.keywords?.keywords?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {movieDetail.keywords.keywords.map((k) => (
                      <Link key={k.id} to={`/movie/keyword/${k.id}`}>
                        <span className="inline-block border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors uppercase tracking-wider">
                          {k.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Production Companies */}
              {movieDetail.production_companies?.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Companies</h3>
                  <div className="flex flex-col gap-3">
                    {movieDetail.production_companies.map((comp) => (
                      <Link key={comp.id} to={`/movie/company/${comp.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        &copy; {comp.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </main>
    </Transitions>
  );
};

export default Movie;