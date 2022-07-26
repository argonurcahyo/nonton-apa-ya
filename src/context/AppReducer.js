export const ACTIONS = {
  ADD_MOVIE_TO_WATCHLIST: "ADD_MOVIE_TO_WATCHLIST",
  REMOVE_MOVIE_FROM_WATCHLIST: "REMOVE_MOVIE_FROM_WATCHLIST",
  ADD_MOVIE_TO_WATCHED: "ADD_MOVIE_TO_WATCHED",
  MOVE_TO_WATCHLIST: "MOVE_TO_WATCHLIST",
  REMOVE_FROM_WATCHED: "REMOVE_FROM_WATCHED"
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_MOVIE_TO_WATCHLIST:
      return {
        ...state,
        watchlist: [action.payload, ...state.watchlist],
      };
    case ACTIONS.REMOVE_MOVIE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.payload),
      };
    case ACTIONS.ADD_MOVIE_TO_WATCHED:
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.payload.id),
        watched: [action.payload, ...state.watched],
      };
    case ACTIONS.MOVE_TO_WATCHLIST:
      return {
        ...state,
        watchlist: [action.payload, ...state.watchlist],
        watched: state.watched.filter((movie) => movie.id !== action.payload.id),

      };
    case ACTIONS.REMOVE_FROM_WATCHED:
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.id !== action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
