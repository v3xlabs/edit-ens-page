import { FC, PropsWithChildren } from 'react';
import { FiX } from 'react-icons/fi';

export const Dialog: FC<PropsWithChildren<{ onClose: () => void }>> = ({
    onClose,
    children,
}) => {
    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div tabIndex={-1}>
            <div className="fixed z-10 inset-0 bg-ens-light-grey-active/20 dark:bg-ens-light-grey-active/20 backdrop-blur-md"></div>
            <div className="fixed z-20 inset-x-0 bottom-0 md:inset-0 flex items-center justify-center max-w-full">
                <div className="relative bg-ens-light-background-primary dark:bg-ens-dark-background-primary p-4 rounded-t-xl md:rounded-b-xl shadow-xl w-full max-w-md border border-ens-light-border dark:border-ens-dark-border">
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="absolute top-4 right-4 p-1 hover:bg-ens-light-grey-surface hover:dark:bg-ens-dark-grey-surface rounded-full"
                    >
                        <FiX />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};
