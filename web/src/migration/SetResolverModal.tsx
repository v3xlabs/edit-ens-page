import { FC, useState } from 'react';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { namehash } from 'viem';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { DEVELOPER_MODE } from '../App';
import { Dialog } from '../dialog/Dialog';
import { ENS_MAINNET_REGISTRY } from '../Profile';
import { TransactionReceiptModal } from '../transaction/TransactionReceiptModal';

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
    const [testReceiptOpen, setTestReceiptOpen] = useState(false);

    const onClosez = () => {
        setTestReceiptOpen(false);
        onClose();
    };

    return (
        <>
            {!receipt && !testReceiptOpen && (
                <Dialog onClose={onClosez}>
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
                            onClick={onClosez}
                            className="btn btn-secondary btn-pad btn-full"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => {
                                write();
                            }}
                            className="relative flex items-center justify-center btn btn-primary btn-pad btn-full"
                        >
                            Update Resolver
                            {isLoading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <FiLoader className="animate-spin" />
                                </div>
                            )}
                        </button>
                        {DEVELOPER_MODE && (
                            <>
                                <button
                                    onClick={() => {
                                        setTestReceiptOpen(true);
                                    }}
                                    className="relative flex items-center justify-center btn btn-primary btn-pad btn-full"
                                >
                                    Test Transaction Receipt
                                </button>
                            </>
                        )}
                    </div>
                </Dialog>
            )}
            {testReceiptOpen && (
                <TransactionReceiptModal
                    hash="0x4a7f7ec3f38d09fc7ffcf6acaf5231bf554de2ccbe37ab476b2523246f7e2bea"
                    onClose={onClosez}
                />
            )}
            {receipt && (
                <TransactionReceiptModal
                    hash={receipt.hash}
                    onClose={onClosez}
                />
            )}
        </>
    );
};
