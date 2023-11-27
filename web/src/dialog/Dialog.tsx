import { clsx } from 'clsx';
import { FC, PropsWithChildren, useRef } from 'react';
import { FiX } from 'react-icons/fi';

const variants = {
    top: {
        outer: 'inset-x-0 top-0',
        inner: 'rounded-b-xl',
    },
    bottom: {
        outer: 'inset-x-0 bottom-0',
        inner: 'rounded-t-xl',
    },
    auto: {
        outer: 'inset-x-0 bottom-0 md:inset-0',
        inner: 'rounded-t-xl md:rounded-b-xl',
    },
};

const close_styling = {
    center: 'absolute left-1/2 -translate-x-1/2 -bottom-9 bg-ens-light-background-primary dark:bg-ens-dark-background-primary rounded-full p-1.5',
    corner: 'absolute top-4 right-4 p-1 hover:bg-ens-light-grey-surface hover:dark:bg-ens-dark-grey-surface rounded-full',
};

export const Dialog: FC<
    PropsWithChildren<{
        onClose: () => void;
        variant?: 'bottom' | 'top' | 'auto';
        closeVariant?: 'center' | 'corner';
    }>
> = ({ onClose, children, variant = 'auto', closeVariant = 'corner' }) => {
    const vstyle = variants[variant];
    const closestyle = close_styling[closeVariant];

    const dialog = useRef(null);
    const backdrop = useRef(null);

    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div tabIndex={-1} className="fixed z-50">
            <div
                ref={backdrop}
                className="fixed z-0 inset-0 bg-ens-light-grey-active/20 dark:bg-ens-light-grey-active/20 backdrop-blur-md animate-backdrop"
            ></div>
            <div
                ref={dialog}
                className={clsx(
                    'fixed z-10 flex items-center justify-center max-w-full animate-dialog',
                    vstyle.outer
                )}
            >
                <div
                    className={clsx(
                        'relative bg-ens-light-background-primary dark:bg-ens-dark-background-primary p-4 shadow-xl w-full max-w-md border border-ens-light-border dark:border-ens-dark-border',
                        vstyle.inner
                    )}
                >
                    <button
                        onClick={async () => {
                            const dialogElm: HTMLElement = dialog.current;
                            const backdropElm: HTMLElement = backdrop.current;

                            await Promise.all([
                                dialogElm.animate(
                                    [
                                        {
                                            top: '0px',
                                            opacity: 1,
                                        },
                                        {
                                            top: '-100px',
                                            opacity: 0,
                                        },
                                    ],
                                    {
                                        duration: 200,
                                        fill: 'forwards',
                                    }
                                ).finished,
                                backdropElm.animate(
                                    [
                                        {
                                            opacity: 1,
                                        },
                                        {
                                            opacity: 0,
                                        },
                                    ],
                                    {
                                        duration: 200,
                                        fill: 'forwards',
                                    }
                                ).finished,
                            ]);
                            onClose();
                        }}
                        className={clsx('absolute', closestyle)}
                    >
                        <FiX />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};
