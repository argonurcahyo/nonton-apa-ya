import React from 'react'
import { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb'
import ImageSlider from './ImageSlider'

const TVEpisodeDetail = ({ episode }) => {
  if (!episode) return null

  const seasonNumber = episode?.season_number?.toString().padStart(2, "0")
  const episodeNumber = episode?.episode_number?.toString().padStart(2, "0")

  return (
    <div className="flex flex-col gap-5 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Season {seasonNumber} • Episode {episodeNumber}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {episode?.name || "Untitled Episode"}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {episode?.air_date && (
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              <i className="fa-regular fa-calendar"></i>
              {episode.air_date}
            </span>
          )}
          {episode?.runtime && (
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              <i className="fa-regular fa-clock"></i>
              {episode.runtime} min
            </span>
          )}
        </div>
      </div>

      {/* Media */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
        {episode?.images?.stills?.length > 0 ? (
          <ImageSlider images={episode.images.stills.map(im => (`${BASE_IMG_URL}${im?.file_path}`))} />
        ) : (
          <img
            className="w-full max-h-[320px] object-cover"
            src={NO_IMG_URL_LANDSCAPE}
            alt="No still available"
          />
        )}
      </div>

      {/* Overview */}
      {episode?.overview && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Synopsis</h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
            {episode.overview}
          </p>
        </div>
      )}
    </div>
  )
}

export default TVEpisodeDetail