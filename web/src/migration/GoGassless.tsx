import { FC, useState } from 'react';

import { SetResolverModal } from './SetResolverModal';

export const GoGassless: FC<{ name: string }> = ({ name }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="z-10 h-12 w-full rounded-4xl p-2 max-w-2xs md:max-w-full mx-auto bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent"
                onClick={() => {
                    console.log('Go Gassless');
                    setIsOpen(true);
                }}
            >
                Go Gassless
            </button>
            {isOpen && (
                <SetResolverModal
                    name={name}
                    resolver="0xdCcB68ac05BB2Ee83F0873DCd0BF5F57E2968344"
                    onClose={() => {
                        setIsOpen(false);
                    }}
                />
            )}
        </>
    );
};
