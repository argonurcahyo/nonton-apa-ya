import axios from "axios";

const baseUrl = 'https://nonton-api.vercel.app/api';

const nonton = axios.create({
    baseURL: baseUrl,
});

export default nonton