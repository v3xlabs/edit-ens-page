import { MenuSVG } from '@ensdomains/thorin';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

import { Field } from './field/Field';
import { UserProfile } from './UserProfile';

export const GATEWAY_VIEW = 'https://rs.myeth.id/view/';

type ProfileResponse = {
    name: string;
    records: Record<string, string>;
    addresses: Record<string, string>;
};

export const getProfile = async (name: string) => {
    const request = await fetch(GATEWAY_VIEW + name);

    const data: ProfileResponse = await request.json();

    return data;
};

export const App = () => {
    // eslint-disable-next-line no-undef
    const path = window.location.pathname;
    const name = path.replace('/', '');

    if (!/^([\dA-Za-z-]([\d.A-Za-z-])+\.)+[\dA-Za-z-]+$/.test(name))
        return <div>Invalid ENS name</div>;

    const { data } = useSWR(name, getProfile);
    const { address } = useAccount();

    if (!data) return <div>Loading...</div>;

    return (
        <div className="w-full mx-auto max-w-xl px-4 pt-8 pb-16 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2">
                <div className="flex gap-4 items-center">
                    <img src="/mark.svg" alt="mark" className="h-12" />
                    <button onClick={() => {}}>
                        <MenuSVG />
                    </button>
                </div>
                <div className="h-12">
                    <UserProfile />
                </div>
            </div>
            <div className="px-4">
                <span className="block font-bold text-3xl">
                    {name.split('.')[0]}
                </span>
                <span className="block text-xl">
                    .{name.split('.').slice(1).join('.')}
                </span>
            </div>
            <div className="relative flex flex-col items-center gap-4 p-4 bg-ens-light-background-primary dark:bg-ens-dark-background-primary border-ens-light-border dark:border-ens-dark-border border rounded-2xl">
                <div className="w-full flex items-center justify-center">
                    <div className="relative aspect-square h-40 w-40">
                        <div className="aspect-square h-40 overflow-hidden w-40 rounded-full drop-shadow-md bg-ens-light-background-secondary dark:bg-ens-dark-background-secondary">
                            <div
                                className="w-full h-full"
                                style={{
                                    background:
                                        'linear-gradient(323deg, #DE82FF -15.56%, #7F6AFF 108.43%)',
                                }}
                            >
                                {data.records['avatar'] && (
                                    <img
                                        src={data.records['avatar']}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                        {address && (
                            <div className="right-1 bottom-1 absolute w-14 h-14 rounded-full bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent flex items-center justify-center">
                                E
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Field
                        label="Display Name"
                        record="name"
                        value={data.records['display']}
                    />
                    <Field
                        label="Website"
                        record="url"
                        value={data.records['url']}
                    />
                    <Field
                        label="X"
                        record="com.twitter"
                        value={data.records['com.twitter']}
                    />
                    <Field
                        label="Telegram"
                        record="org.telegram"
                        value={data.records['org.telegram']}
                    />
                    <Field
                        label="Discord"
                        record="com.discord"
                        value={data.records['com.discord']}
                    />
                    <Field
                        label="Github"
                        record="com.github"
                        value={data.records['com.github']}
                    />
                </div>
                {address && (
                    <div className="fixed md:relative bottom-0 inset-x-0 w-full">
                        <div className="relative w-full flex justify-center p-3 md:p-0">
                            <button className="z-10 w-full rounded-4xl p-2 max-w-2xs md:max-w-full mx-auto bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent">
                                Update profile
                            </button>
                            <div className="md:hidden bg-gradient-to-t from-black/20 to-black/0 absolute inset-0"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
