import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 10000, // 10 second timeout
    timeoutErrorMessage: 'Request timed out. Please try again.',
    // Retry on network errors
    retry: 1,
    retryDelay: 1000
});

// Add retry mechanism
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

    // Create new promise to handle retry
    const backoff = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, config.retryDelay || 1000);
    });

    // Wait for backoff before retrying
    await backoff;
    return api(config);
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
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('apiCache');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api; 