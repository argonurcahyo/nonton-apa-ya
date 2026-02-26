import React from 'react';
import Moment from 'react-moment';
import { BASE_IMG_URL, NO_IMG_URL_LANDSCAPE } from '../apis/tmdb';
import ImageSlider from './ImageSlider';

const TVEpisodeDetail = ({ episode }) => {
  if (!episode) return null;

  // Formatting Season and Episode numbers (e.g., S01E01)
  const formattedSeason = episode.season_number?.toString().padStart(2, "0");
  const formattedEpisode = episode.episode_number?.toString().padStart(2, "0");

  return (
    <div className="flex flex-col gap-6 text-slate-900 dark:text-slate-100 pb-2">
      
      {/* 1. HEADER: Title & Badge */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {/* SxxExx Badge */}
          <span className="flex-shrink-0 mt-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider shadow-sm border border-purple-200 dark:border-purple-800">
            S{formattedSeason}E{formattedEpisode}
          </span>
          
          {/* Episode Title */}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            {episode.name}
          </h2>
        </div>

        {/* Meta Info Row (Air Date, Runtime, Rating) */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50 pb-4">
          {episode.air_date && (
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-calendar text-purple-500"></i>
              <Moment format="MMMM Do, YYYY">{episode.air_date}</Moment>
            </span>
          )}
          
          {episode.runtime > 0 && (
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-clock text-purple-500"></i>
              {episode.runtime} min
            </span>
          )}

          {episode.vote_average > 0 && (
            <div className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded border border-yellow-400/30">
              <i className="fa-solid fa-star text-xs"></i>
              <span className="font-bold">{episode.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MEDIA: Image Slider or Fallback Image */}
      <div className="w-full relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 shadow-md">
        {episode.images?.stills?.length > 0 ? (
          <ImageSlider images={episode.images.stills.map(im => `${BASE_IMG_URL}${im.file_path}`)} />
        ) : (
          <img 
            className="w-full h-full object-cover" 
            src={NO_IMG_URL_LANDSCAPE} 
            alt={episode.name || "No image available"} 
          />
        )}
      </div>

      {/* 3. OVERVIEW / SYNOPSIS */}
      <div className="mt-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
          Synopsis
        </h3>
        {episode.overview ? (
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
            {episode.overview}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            No synopsis available for this episode.
          </p>
        )}
      </div>

      {/* 4. GUEST STARS (Optional, but usually included in the episode object) */}
      {episode.guest_stars?.length > 0 && (
        <div className="mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
            Guest Stars
          </h3>
          <div className="flex flex-wrap gap-2">
            {episode.guest_stars.slice(0, 8).map((actor, i) => (
              <span key={i} className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-colors">
                {actor.name} <span className="font-normal opacity-70">as {actor.character}</span>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default TVEpisodeDetail;