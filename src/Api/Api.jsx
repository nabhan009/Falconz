import axios from "axios";

const api= axios.create({
    baseURL:"https://ecomdb-3.onrender.com",
    headers: {"content-type": "application/json"},
})
export default api;