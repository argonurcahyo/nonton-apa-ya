import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
const baseUrl = 'https://api.themoviedb.org/3/';

const tmdb = axios.create({
    baseURL: baseUrl,
    // params: {
    //     api_key: API_KEY,
    // },
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
    }
});
export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
export const NO_IMG_URL = "https://i.mydramalist.com/ZN5Ak_4c.jpg";
export const NO_IMG_URL_LANDSCAPE = "https://matematego.com/assets/noimage-cf86abd9b579765c1131ec86cb1e70052199ddadfecf252e5cb98e50535d11f3.png"
export const BASE_FLAG_URL = 'https://flagsapi.com/';
export const BD_LOADING = "https://i.pinimg.com/originals/3d/6a/a9/3d6aa9082f3c9e285df9970dc7b762ac.gif";
export default tmdb;