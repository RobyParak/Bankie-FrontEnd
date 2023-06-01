import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://localhost:8081/'
});
export default instance;