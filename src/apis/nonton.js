import axios from "axios";

const baseUrl = 'https://nonton-api.vercel.app/api';
const localBaseUrl = 'http://localhost:3210/api';

const nonton = axios.create({
    baseURL: baseUrl,
});

export default nonton