import { EnsSVG } from '@ensdomains/thorin';
import { FC, ReactNode } from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { FiBook, FiChevronRight, FiGithub, FiYoutube } from 'react-icons/fi';

import { Dialog } from '../dialog/Dialog';

const icons: [ReactNode, string][] = [
    [<BsTwitterX />, 'https://twitter.com/ensdomains'],
    [<FiGithub />, 'https://github.com/ensdomains'],
    [<FaDiscord />, 'https://chat.ens.domains'],
    [<FiYoutube />, 'https://youtube.com/ensdomains'],
    [<FiBook />, 'https://blog.ens.domains'],
];

export const Header: FC<{ name; onClose: () => void }> = ({
    onClose,
    name,
}) => {
    return (
        <div className="z-50 absolute">
            <Dialog onClose={onClose} variant="top" closeVariant="center">
                <div className="space-y-4">
                    <a
                        href={'https://ens.app/' + name}
                        target="_blank"
                        className="btn btn-outline btn-full text-start flex items-center gap-2"
                    >
                        <EnsSVG />
                        <div className="w-full">View name in ENS App</div>
                        <FiChevronRight />
                    </a>
                    <button className="btn btn-outline btn-full text-start flex justify-between !px-3">
                        <div>Theme</div>
                        <div>
                            <div className="block dark:hidden">Light</div>
                            <div className="hidden dark:block">Dark</div>
                        </div>
                    </button>
                    <div className="bg-ens-light-grey-surface dark:bg-ens-dark-grey-surface rounded-xl p-4 w-full flex justify-around text-2xl">
                        {icons.map(([icon, link]) => (
                            <a href={link} target="_blank" key={link}>
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
