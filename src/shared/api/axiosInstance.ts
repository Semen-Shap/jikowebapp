import axios from "axios";

const apiUrl = process.env.REACT_APP_URL_BACKEND
const url = `${apiUrl}`;


export const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json'
  }
});