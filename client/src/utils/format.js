// Format a number with commas and specified decimal places
export const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return '0';
    
    const num = Number(value);
    if (isNaN(num)) return '0';
    
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

// Format a percentage value
export const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0%';
    
    const num = Number(value);
    if (isNaN(num)) return '0%';
    
    return `${num.toFixed(2)}%`;
};

// Shorten an Ethereum address
export const shortenAddress = (address) => {
    if (!address) return '';
    if (address.length < 10) return address;
    
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format a date to a readable string
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}; 