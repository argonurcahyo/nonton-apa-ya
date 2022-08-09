import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const baseUrl = 'https://api.themoviedb.org/3/';

const tmdb = axios.create({
    baseURL: baseUrl,
    params: {
        api_key: API_KEY,
    },
});
export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
export const NO_IMG_URL = "https://i.mydramalist.com/ZN5Ak_4c.jpg";
export const BASE_FLAG_URL = 'https://countryflagsapi.com/png/';
export const BD_LOADING = "https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif";
export default tmdb;