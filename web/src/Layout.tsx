/* eslint-disable no-undef */
import { MenuSVG } from '@ensdomains/thorin';
import { FC, PropsWithChildren, useState } from 'react';

import { Header } from './header/Header';
import { UserProfile } from './UserProfile';

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [headerExpanded, setHeaderExpanded] = useState(false);

    return (
        <>
            {headerExpanded && (
                <Header
                    onClose={() => {
                        setHeaderExpanded(false);
                    }}
                    name={location?.href?.replace('/', '')}
                />
            )}
            <div className="w-full mx-auto max-w-xl px-4 pt-8 pb-16 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2">
                    <div className="flex gap-4 items-center">
                        <a href="/">
                            <img src="/mark.svg" alt="mark" className="h-12" />
                        </a>
                        <button
                            onClick={() => {
                                setHeaderExpanded(true);
                            }}
                        >
                            <MenuSVG />
                        </button>
                    </div>
                    <div className="h-12">
                        <UserProfile />
                    </div>
                </div>
                {children}
            </div>
        </>
    );
};
