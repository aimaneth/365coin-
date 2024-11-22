import { InjectedConnector } from '@web3-react/injected-connector';
import { BscConnector } from '@binance-chain/bsc-connector';

export const injected = new InjectedConnector({
    supportedChainIds: [56, 97], // BSC Mainnet and Testnet
});

export const bscConnector = new BscConnector({
    supportedChainIds: [56, 97]
}); 