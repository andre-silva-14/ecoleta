import axios from 'axios';

const api = axios.create({
    baseURL: 'https://f6b06e8aeb18.ngrok.io',
});

export default api;