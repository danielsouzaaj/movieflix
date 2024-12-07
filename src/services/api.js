import axios from "axios";

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    params: {
        api_key: 'a6537545953aa1da6e334f5e976d4caa',
        language: 'pt-BR',
    }
})

export default api;