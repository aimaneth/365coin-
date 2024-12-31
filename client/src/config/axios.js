import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false,
    timeout: 8000, // Reduced timeout to 8 seconds
    timeoutErrorMessage: 'Request timed out. Please try again.',
    // Add retry configuration
    retry: 2,
    retryDelay: 1000
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

// Response interceptor with retry logic
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { config } = error;
        
        // If config is undefined or we've already retried, reject
        if (!config || !config.retry) {
            return Promise.reject(error);
        }

        // Set the retry count
        config.retryCount = config.retryCount || 0;

        // Check if we should retry the request
        if (config.retryCount >= config.retry) {
            // We've run out of retries
            return Promise.reject(error);
        }

        // Increment the retry count
        config.retryCount += 1;

        // Create a delay
        const delay = new Promise((resolve) => {
            setTimeout(resolve, config.retryDelay || 1000);
        });

        // Return the promise with the retry
        await delay;
        return api(config);
    }
);

export default api; 