import { CopySVG, ExitSVG } from '@ensdomains/thorin';
import { FC, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { Dialog } from '../dialog/Dialog';

export const ProfilePage: FC<{ onClose: () => void }> = ({ onClose }) => {
    const user = useAccount();
    const [display, setDisplay] = useState(
        user.address.slice(0, 6) + '...' + user.address.slice(-4)
    );

    (async () => {
        const data = await fetch(
            'https://worker.enstate.rs/a/' + user.address
        ).then((response) => response.json());

        if (data.name) {
            setDisplay(data.name);
        }

        if (data.display) {
            setDisplay(data.display);
        }
    })();

    const { disconnect } = useDisconnect();

    return (
        <div className="z-50 absolute animate-from-top">
            <Dialog onClose={onClose} variant="top" closeVariant="center">
                <div className="items-center flex-col w-full space-y-4">
                    <button
                        title={'Click to copy ' + user.address}
                        onClick={() => {
                            // eslint-disable-next-line no-undef
                            navigator.clipboard.writeText(user.address);
                        }}
                        className="justify-center w-full flex flex-row items-center gap-x-2 active:scale-90 transition-transform"
                    >
                        <CopySVG />
                        {display}
                    </button>
                    <button
                        onClick={() => {
                            disconnect();
                            onClose();
                        }}
                        className="justify-center w-full text-ens-light-red-primary dark:text-ens-light-red-primary flex flex-row items-center gap-x-2 scale-90 transition-transform"
                    >
                        <ExitSVG />
                        Disconnect
                    </button>
                </div>
            </Dialog>
        </div>
    );
};
