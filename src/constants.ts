const API_URL_DEV = "http://localhost:8000";
const API_URL_PROD = "https://api.ucsc.info";

export const BASE_API_URL = import.meta.env.VITE_ENV == "local" ? API_URL_DEV : API_URL_PROD;