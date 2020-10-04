import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://netcine-andre.herokuapp.com/",
});

export default instance;
