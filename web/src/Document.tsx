import { EIP6963Connector, walletConnectProvider } from '@web3modal/wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { FC, PropsWithChildren } from 'react';
import { mainnet } from 'viem/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'b451d5ff25d61b3fde7b30f167a5a957';

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
    [mainnet],
    [/* walletConnectProvider({ projectId }), */ publicProvider()]
);

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({
            chains,
            options: { projectId, showQrModal: false, metadata },
        }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        new CoinbaseWalletConnector({
            chains,
            options: { appName: metadata.name },
        }),
    ],
    publicClient,
});

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export const Document: FC<PropsWithChildren<{}>> = ({ children }) => {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
