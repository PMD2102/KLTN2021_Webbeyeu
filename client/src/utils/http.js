import axios from "axios";
import { BACKEND_URI } from 'constants/keys';

const fetchClient = () => {
  const defaultOptions = {
    baseURL: `${BACKEND_URI}/api`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return instance;
};

export default fetchClient();

