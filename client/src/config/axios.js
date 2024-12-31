import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 15000, // 15 seconds timeout
    timeoutErrorMessage: 'Request timed out. Please try again.'
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                response: {
                    data: {
                        message: 'Request timed out. Please try again.'
                    }
                }
            });
        }

        // Handle 401 errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('apiCache');
            if (!error.config.url.includes('/auth/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api; 