import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 30000, // Increase to 30 seconds
    timeoutErrorMessage: 'Request timed out. Please try again.',
    // Improve retry mechanism
    retry: 2,
    retryDelay: 1000,
    retryCondition: (error) => {
        return (
            axios.isNetworkError(error) || 
            error.code === 'ECONNABORTED' ||
            error.response?.status >= 500
        );
    }
});

// Add retry mechanism with exponential backoff
api.interceptors.response.use(undefined, async (err) => {
    const { config } = err;
    if (!config || !config.retry) {
        return Promise.reject(err);
    }

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }

    config.__retryCount += 1;

    // Exponential backoff
    const backoffDelay = config.retryDelay * Math.pow(2, config.__retryCount - 1);
    
    // Create new promise to handle retry with backoff
    const backoff = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, backoffDelay);
    });

    // Clear auth header if it's a 401 error
    if (err.response?.status === 401) {
        delete config.headers.Authorization;
    }

    // Wait for backoff before retrying
    await backoff;
    return api(config);
});

// Request interceptor with better error handling
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with better error handling
api.interceptors.response.use(
    (response) => {
        // Cache successful responses for auth endpoints
        if (response.config.url?.includes('/auth/') && response.status === 200) {
            const cache = localStorage.getItem('apiCache') ? JSON.parse(localStorage.getItem('apiCache')) : {};
            cache[response.config.url] = {
                data: response.data,
                timestamp: Date.now()
            };
            localStorage.setItem('apiCache', JSON.stringify(cache));
        }
        return response;
    },
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error);
            return Promise.reject({
                response: {
                    data: {
                        message: 'Network error. Please check your connection and try again.'
                    }
                }
            });
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout Error:', error);
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