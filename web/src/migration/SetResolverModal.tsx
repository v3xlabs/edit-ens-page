import { FC } from 'react';
import { FiAlertTriangle, FiLoader, FiX } from 'react-icons/fi';
import { namehash } from 'viem';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { ENS_MAINNET_REGISTRY } from '../App';

export const SetResolverModal: FC<{
    resolver: string;
    name: string;
    onClose: () => void;
}> = ({ resolver, name, onClose }) => {
    const { data, config } = usePrepareContractWrite({
        address: ENS_MAINNET_REGISTRY,
        abi: [
            {
                name: 'setResolver',
                type: 'function',
                inputs: [
                    {
                        name: 'node',
                        type: 'bytes32',
                    },
                    {
                        name: 'resolver',
                        type: 'address',
                    },
                ],
                outputs: [],
                stateMutability: 'nonpayable',
            },
        ],
        functionName: 'setResolver',
        args: [namehash(name), resolver],
    });
    const { write, data: receipt, isLoading } = useContractWrite(config);

    return (
        <div>
            <div className="fixed z-10 inset-0 bg-white/10 backdrop-blur-md"></div>
            <div className="fixed z-20 inset-x-0 bottom-0 md:inset-0 flex items-center justify-center">
                <div className="relative bg-ens-light-background-primary dark:bg-ens-dark-background-primary p-4 rounded-t-xl md:rounded-b-xl shadow-xl max-w-md border border-ens-light-border dark:border-ens-dark-border">
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="absolute top-4 right-4"
                    >
                        <FiX />
                    </button>
                    <div className="p-4 space-y-2">
                        <div className="w-8 h-8 p-2 rounded-full bg-ens-light-yellow-primary dark:bg-ens-dark-yellow-primary mx-auto flex items-center justify-center">
                            <FiAlertTriangle stroke="#fff" />
                        </div>
                        <div className="font-bold text-center">
                            You are about to set your resolver
                        </div>
                        <p className="text-center">
                            There are one time gas fees associated with
                            upgrading your name.
                        </p>
                        <p className="text-center text-xs">
                            (After this you can enjoy the benifits of{' '}
                            <i>gassless</i>)
                        </p>
                    </div>
                    <div className="gap-2 flex flex-col">
                        <button
                            onClick={() => {
                                onClose();
                            }}
                            className="w-full p-4 rounded-xl bg-ens-light-blue-surface text-ens-light-blue-dim dark:bg-ens-dark-blue-surface dark:text-ens-dark-blue-dim"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                write();
                            }}
                            className="relative flex items-center justify-center w-full p-4 rounded-xl bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent"
                        >
                            Update Resolver
                            {isLoading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <FiLoader className="animate-spin" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
