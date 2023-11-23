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

    let timeout: any;

    return (
        <div className="z-50 absolute">
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
                        {/* Copy symbol */}
                        <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.8335 16C7.54483 16 6.50016 14.9553 6.50016 13.6667V7C6.50016 5.71134 7.54483 4.66667 8.8335 4.66667H12.8335C14.1222 4.66667 15.1668 5.71134 15.1668 7V13.6667C15.1668 14.9553 14.1222 16 12.8335 16H8.8335ZM8.50016 13.6667C8.50016 13.8508 8.6494 14 8.8335 14H12.8335C13.0176 14 13.1668 13.8508 13.1668 13.6667V7C13.1668 6.81591 13.0176 6.66667 12.8335 6.66667H8.8335C8.6494 6.66667 8.50016 6.81591 8.50016 7V13.6667Z"
                                fill="white"
                            />
                            <path
                                d="M4.16683 0C2.87817 0 1.8335 1.04467 1.8335 2.33333V9C1.8335 10.2887 2.87817 11.3333 4.16683 11.3333C4.71911 11.3333 5.16683 10.8856 5.16683 10.3333C5.16683 9.78105 4.71911 9.33333 4.16683 9.33333C3.98273 9.33333 3.8335 9.1841 3.8335 9V2.33333C3.8335 2.14924 3.98273 2 4.16683 2H8.16683C8.35092 2 8.50016 2.14924 8.50016 2.33333C8.50016 2.88562 8.94788 3.33333 9.50016 3.33333C10.0524 3.33333 10.5002 2.88562 10.5002 2.33333C10.5002 1.04467 9.45549 0 8.16683 0H4.16683Z"
                                fill="white"
                            />
                        </svg>
                        {display}
                    </button>
                    <button
                        onClick={() => {
                            disconnect();
                            onClose();
                        }}
                        className="justify-center w-full text-ens-light-red-primary dark:text-ens-light-red-primary flex flex-row items-center gap-x-2 scale-90 transition-transform"
                    >
                        {/* Disconnect symbol */}
                        <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clip-path="url(#clip0_92_9324)">
                                <path
                                    d="M3.5 0.666626C1.84315 0.666626 0.5 2.00977 0.5 3.66663V12.3333C0.5 13.9901 1.84315 15.3333 3.5 15.3333H6.83333C8.49019 15.3333 9.83333 13.9901 9.83333 12.3333V11.6666C9.83333 11.1143 9.38562 10.6666 8.83333 10.6666C8.28105 10.6666 7.83333 11.1143 7.83333 11.6666V12.3333C7.83333 12.8856 7.38562 13.3333 6.83333 13.3333H3.5C2.94772 13.3333 2.5 12.8856 2.5 12.3333V3.66663C2.5 3.11434 2.94772 2.66663 3.5 2.66663H6.83333C7.38562 2.66663 7.83333 3.11434 7.83333 3.66663V4.33329C7.83333 4.88558 8.28105 5.33329 8.83333 5.33329C9.38562 5.33329 9.83333 4.88558 9.83333 4.33329V3.66663C9.83333 2.00977 8.49019 0.666626 6.83333 0.666626H3.5Z"
                                    fill="#C6301B"
                                />
                                <path
                                    d="M16.2437 8.66849C16.4079 8.48586 16.5 8.24801 16.5 7.99996C16.5 7.70304 16.3706 7.43634 16.1651 7.25319L12.8356 4.25666C12.4251 3.88721 11.7928 3.92048 11.4234 4.33099C11.0539 4.7415 11.0872 5.37379 11.4977 5.74325L12.894 6.99996L6.83333 6.99996C6.28105 6.99996 5.83333 7.44767 5.83333 7.99996C5.83333 8.55224 6.28105 8.99996 6.83333 8.99996L12.894 8.99996L11.4977 10.2567C11.0872 10.6261 11.0539 11.2584 11.4234 11.6689C11.7928 12.0794 12.4251 12.1127 12.8356 11.7433L16.169 8.74325C16.1953 8.71955 16.2202 8.69458 16.2437 8.66849Z"
                                    fill="#C6301B"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_92_9324">
                                    <rect
                                        width="16"
                                        height="16"
                                        fill="white"
                                        transform="translate(0.5)"
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                        Disconnect
                    </button>
                </div>
            </Dialog>
        </div>
    );
};
