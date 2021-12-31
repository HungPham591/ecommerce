import axios from 'axios';

const clientAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "127.0.0.1:5000",   
})
clientAxios.interceptors.request.use((res) => {
    const accessToken = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    
    if (accessToken) {
        res.headers["x-access-token"] = accessToken;       
    }
    return res;
})

export default clientAxios;
