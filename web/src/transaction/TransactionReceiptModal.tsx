import { FC } from 'react';
import { FiBox, FiClock, FiExternalLink, FiLoader } from 'react-icons/fi';
import { useWaitForTransaction } from 'wagmi';

import { Dialog } from '../dialog/Dialog';

export const TransactionReceiptModal: FC<{
    hash: string;
    onClose: () => void;
}> = ({ hash, onClose }) => {
    const { data, isLoading, isSuccess } = useWaitForTransaction({
        chainId: 1,
        hash: hash as `0x${string}`,
    });

    console.log(data);

    return (
        <Dialog onClose={onClose}>
            <div className="p-2 space-y-2 break-all">
                {isLoading && <b>Awaiting transaction</b>}
                {isSuccess && <b>Transaction Success</b>}
                <a
                    target="_blank"
                    href={'https://etherscan.io/tx/' + hash}
                    className="text-ens-light-blue-primary flex items-center gap-2 hover:underline"
                >
                    <div className="truncate">{hash}</div>
                    <FiExternalLink className="text-2xl" />
                </a>
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <FiLoader className="animate-spin text-xl" />
                    </div>
                )}
                {isSuccess && data && (
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div className="flex gap-1">
                                <FiBox />
                                <div className="text-xs">
                                    {data.blockNumber.toString()}
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <FiClock />
                                <div className="text-xs">A few moments ago</div>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-full"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </Dialog>
    );
};
