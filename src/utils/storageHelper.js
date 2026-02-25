/**
 * Utility functions for localStorage management
 * Prevents repetitive string manipulation and parsing
 */

const STORAGE_KEYS = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  TV_WATCHED: 'tvWatched'
}

export const loadFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error)
    return defaultValue
  }
}

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}

export const loadInitialState = () => ({
  watchlist: loadFromStorage(STORAGE_KEYS.WATCHLIST),
  watched: loadFromStorage(STORAGE_KEYS.WATCHED),
  tvWatched: loadFromStorage(STORAGE_KEYS.TV_WATCHED)
})

export const persistState = (state) => {
  saveToStorage(STORAGE_KEYS.WATCHLIST, state.watchlist)
  saveToStorage(STORAGE_KEYS.WATCHED, state.watched)
  saveToStorage(STORAGE_KEYS.TV_WATCHED, state.tvWatched)
}

export default STORAGE_KEYS
