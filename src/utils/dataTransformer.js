/**
 * Extract common movie/episode data fields
 * Used before API calls to normalize data structure
 */

const MOVIE_FIELDS = [
  'id',
  'title',
  'overview',
  'genre_ids',
  'release_date',
  'vote_average',
  'poster_path',
  'backdrop_path'
]

const EPISODE_FIELDS = [
  'id',
  'season_number',
  'episode_number',
  'name',
  'overview',
  'vote_average',
  'still_path'
]

/**
 * Extract only necessary fields from movie object
 * @param {object} movie - Movie object from TMDB
 * @returns {object} Filtered movie with only required fields
 */
export const extractMovieData = (movie) => {
  return MOVIE_FIELDS.reduce((acc, field) => {
    if (field in movie) acc[field] = movie[field]
    return acc
  }, {})
}

/**
 * Extract only necessary fields from episode object
 * @param {object} episode - Episode object from TMDB
 * @returns {object} Filtered episode with only required fields
 */
export const extractEpisodeData = (episode) => {
  return EPISODE_FIELDS.reduce((acc, field) => {
    if (field in episode) acc[field] = episode[field]
    return acc
  }, {})
}

/**
 * Get year from release/air date
 * @param {string} date - Date string (ISO format)
 * @returns {string} First 4 characters (year)
 */
export const getYear = (date) => date?.substring(0, 4) || 'N/A'

export default {
  extractMovieData,
  extractEpisodeData,
  getYear,
  MOVIE_FIELDS,
  EPISODE_FIELDS
}
