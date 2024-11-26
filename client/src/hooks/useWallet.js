export const useWallet = () => {
    const { active, account, activate, deactivate } = useWeb3React();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const connectWallet = async () => {
        // Wallet connection logic
    };

    return { active, account, connectWallet, isConnecting, error };
}; 