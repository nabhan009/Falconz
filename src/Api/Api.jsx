import axios from "axios";

const api= axios.create({
    baseURL:"https://ecomdb2.onrender.com",
    headers: {"content-type": "application/json"},
})
export default api;