import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from 'crypto-js';


export const base_url = 'https://mss.payvantageapi.com';

export const api_header = {
  "Content-Type": "application/json",
};


export const api_header_jwt = (token) => ({
  "Content-Type": "application/json",
  "Authorization": `${token}`
});

export const showSuccessMessage = (message) => {
  toast.success(message);
  return null;
};

export const showErrorMessage = (message) => {
  toast.error(message);
  return null;
};



// export const retrieveFromLocalStorage = (keys) => {
//     const data = {};
//     keys.forEach((key) => {
//         const persistedState = localStorage.getItem(key);
//         if (persistedState) {
//         try {
//             const bytes = CryptoJS.AES.decrypt(persistedState, APP_SECRET_KEY);
//             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//             if (!decryptedData) {
//               console.error(`Failed to decrypt data for key "${key}"`);
//               data[key] = null;
//               return;
//             }
//             data[key] = JSON.parse(decryptedData);

//             if (typeof data[key] === "string") {
//                 data[key] = JSON.parse(data[key]);
//             }
//         } catch (error) {
//             console.error(`Error parsing JSON for key "${key}":`, error);
//             data[key] = null;
//         }
//     }
//     else {
//         data[key] = null;
//     }
//     });
//     return data;
// }

export const retrieveFromLocalStorage = (keys) => {
    const data = {};
    keys.forEach((key) => {
        const persistedState = localStorage.getItem(key);
        if (persistedState) {
            try {
                const bytes = CryptoJS.AES.decrypt(persistedState, APP_SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                    console.error(`Failed to decrypt data for key "${key}"`);
                    data[key] = null;
                    return;
                }

                // Special handling for token - it's a plain string, not JSON
                if (key === "token") {
                    data[key] = decryptedData;
                    return;
                }

                // For other keys, parse as JSON
                data[key] = JSON.parse(decryptedData);

                // Handle double-stringified data
                if (typeof data[key] === "string") {
                    try {
                        data[key] = JSON.parse(data[key]);
                    } catch {
                        // If second parse fails, keep the string value
                    }
                }
            } catch (error) {
                console.error(`Error parsing JSON for key "${key}":`, error);
                data[key] = null;
            }
        } else {
            data[key] = null;
        }
    });
    return data;
}

export const APP_SECRET_KEY = "cl1930474849@#@$@@^@^"