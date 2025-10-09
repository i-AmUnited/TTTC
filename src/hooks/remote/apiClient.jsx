import Axios from "axios";
import { base_url, api_header, APP_SECRET_KEY } from "../constants";
import CryptoJS from "crypto-js";

export const apiClient = Axios.create(
    {
        baseURL: base_url,
        headers: api_header,
    }
)

export const apiClientWithToken = Axios.create(
    {
        baseURL: base_url,
        headers: api_header,
    }
)

apiClientWithToken.interceptors.request.use(
    (config) => {
        try {
            const encryptedToken = localStorage.getItem("token");
            if (encryptedToken) {
                const decryptedData = CryptoJS.AES.decrypt(encryptedToken, APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                // const parsedData = JSON.parse(decryptedData);
                
                if (decryptedData) {
                    // Set Authorization header with token
                    config.headers["Authorization"] = `${decryptedData}`;
                    config.headers["Content-Type"] = "application/json";
                }
            }
        } catch (error) {
            console.error("Error decrypting token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
)