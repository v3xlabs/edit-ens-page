import { formatAddress } from '@ens-tools/format';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { FC } from 'react';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

export const UserProfile: FC<{ onClick: () => void }> = ({ onClick }) => {
    const { open } = useWeb3Modal();
    const { address } = useAccount();
    const { data: name } = useEnsName({ address });
    const { data: avatar } = useEnsAvatar({
        name,
    });

    if (address) {
        return (
            <button
                onClick={onClick}
                className="flex h-12 items-center gap-2 pl-1.5 pr-6 justify-center rounded-3xl bg-ens-light-background-primary dark:bg-ens-dark-background-primary"
            >
                <div className="w-9 aspect-square rounded-full overflow-hidden bg-ens-light-background-secondary dark:bg-ens-dark-background-secondary">
                    {avatar && (
                        <img
                            src={avatar}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="">{name ?? formatAddress(address)}</div>
            </button>
        );
    }

    return (
        <button
            onClick={() => {
                open();
            }}
            className="text-ens-light-text-accent dark:text-ens-dark-text-accent bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary rounded-3xl px-12 py-2 h-full"
        >
            Connect
        </button>
    );
};
