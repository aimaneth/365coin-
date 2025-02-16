import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false,
    timeout: 30000, // Increased timeout to 30 seconds
    timeoutErrorMessage: 'Request timed out. Please try again.',
    // Add retry configuration
    retry: 3,
    retryDelay: 1000,
    // Add request size limits
    maxContentLength: 10 * 1024 * 1024, // 10MB
    maxBodyLength: 10 * 1024 * 1024 // 10MB
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add timestamp to prevent caching
        config.params = {
            ...config.params,
            _t: Date.now()
        };
        
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

// Response interceptor with enhanced retry logic
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { config, response } = error;
        
        // Handle 503 Service Unavailable specifically
        if (response?.status === 503) {
            // If database is not ready, wait longer before retry
            const backoff = Math.min((config.retryCount || 0) + 1, 3) * 3000; // 3, 6, 9 seconds
            config.retryDelay = backoff;
            
            console.log(`Database not ready, retrying in ${backoff/1000} seconds...`);
            
            // If we haven't retried too many times, try again
            if (!config.retryCount || config.retryCount < 3) {
                config.retryCount = (config.retryCount || 0) + 1;
                
                await new Promise(resolve => setTimeout(resolve, backoff));
                return api(config);
            }
        }
        
        // If config is undefined or we've already retried maximum times, reject
        if (!config || config.retryCount >= config.retry) {
            return Promise.reject(error);
        }

        // For other errors, use standard retry logic
        config.retryCount = config.retryCount || 0;
        
        // Check if we should retry the request
        if (config.retryCount >= config.retry) {
            return Promise.reject(error);
        }

        // Increment the retry count
        config.retryCount += 1;

        // Create exponential backoff delay
        const backoff = Math.pow(2, config.retryCount) * config.retryDelay;

        // Create new promise to handle retry delay
        const delay = new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Retrying request (${config.retryCount}/${config.retry})`);
                resolve();
            }, backoff);
        });

        // Return the promise with the retry
        await delay;
        return api(config);
    }
);

// Add request/response logging in development
if (process.env.NODE_ENV === 'development') {
    api.interceptors.request.use(request => {
        console.log('Starting Request:', request);
        return request;
    });

    api.interceptors.response.use(response => {
        console.log('Response:', response);
        return response;
    });
}

export default api; 