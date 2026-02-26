import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import tmdb, { BASE_IMG_URL, NO_IMG_URL } from '../apis/tmdb';
import useActorMovieFetch from '../hooks/useActorMovieFetch';
import MovieCard from '../components/MovieCard';
import LoadingCard from '../components/LoadingCard';
import Transitions from '../components/Transition';
import Moment from 'react-moment';

const Actor = () => {
  let { id } = useParams();
  const [actorBio, setActorBio] = useState(null);
  const [loadingBio, setLoadingBio] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const {
    hasMore, loading, error, movies
  } = useActorMovieFetch(id, pageNumber)

  const observer = useRef()
  const lastGridElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const fetchActorBio = async (id) => {
    try {
      setLoadingBio(true);
      const fetchedActorBio = await tmdb.get(`person/${id}`);
      setActorBio(fetchedActorBio.data);
    } catch (error) {
      console.log(error);
      setActorBio(null);
    } finally {
      setLoadingBio(false);
    }
  }

  useEffect(() => {
    fetchActorBio(id);
    setPageNumber(1);
  }, [id]);

  useEffect(() => {
    if (actorBio?.name) {
      document.title = `${actorBio.name} - Movies | NontonApaYa`;
    }
  }, [actorBio]);

  return (
    <Transitions>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              <span className="gradient-primary text-gradient">
                {actorBio?.name || "Actor"}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Biography & filmography
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Photo */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-52 sm:w-64 lg:w-full max-w-xs">
                  {loadingBio ? (
                    <div className="w-full aspect-[2/3] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ) : (
                    <img
                      className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
                      src={actorBio?.profile_path ? `${BASE_IMG_URL}${actorBio.profile_path}` : NO_IMG_URL}
                      alt={actorBio?.name}
                    />
                  )}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap gap-3">
                  {actorBio?.birthday && (
                    <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-semibold">
                      <i className="fa-regular fa-calendar"></i>
                      Born <Moment format="MMM D, YYYY">{actorBio.birthday}</Moment>
                    </span>
                  )}
                  {actorBio?.deathday && (
                    <span className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-semibold">
                      <i className="fa-solid fa-cross"></i>
                      Died <Moment format="MMM D, YYYY">{actorBio.deathday}</Moment>
                    </span>
                  )}
                  {actorBio?.place_of_birth && (
                    <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-semibold">
                      <i className="fa-solid fa-location-dot"></i>
                      {actorBio.place_of_birth}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Biography</h3>
                  <div className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    {actorBio?.biography || "No biography available."}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filmography */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Filmography</h2>
              {movies.length > 0 && (
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {movies.length} titles
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-500 mb-4">Error loading movies.</p>
            )}

            {movies.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-8">
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    ref={index === movies.length - 1 ? lastGridElementRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <MovieCard
                      movie={movie}
                      index={index}
                      type="popular"
                    />
                  </motion.div>
                ))}
                {loading && (
                  <LoadingCard />
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                No movies found.
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </Transitions>
  )
}

export default Actor