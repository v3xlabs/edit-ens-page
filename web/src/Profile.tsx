import { FC, PropsWithChildren } from 'react';
import useSWR from 'swr';
import { namehash } from 'viem';
import { useAccount, useContractRead, useEnsResolver } from 'wagmi';

import { DEVELOPER_MODE } from './App';
import { Field } from './field/Field';
import { Layout } from './Layout';
import { GoGassless } from './migration/GoGassless';

export const GATEWAY_VIEW = 'https://rs.myeth.id/view/';
export const GATEWAY_UPDATE = 'https://rs.myeth.id/update';
export const ENSTATE_URL = 'https://worker.enstate.rs/n/';
export const ENS_MAINNET_REGISTRY =
    '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

type ProfileResponse = {
    name: string;
    records: Record<string, string>;
    addresses: Record<string, string>;
};

type EnstateResponse = {
    name: string;
    avatar: string;
    records: Record<string, string>;
    chains: Record<string, string>;
};

const getEnstate = async (name: string) => {
    try {
        const request = await fetch(ENSTATE_URL + name);

        const data: EnstateResponse = await request.json();

        return data;
    } catch {
        console.log('Failed to load from ccip gateway');
    }
};

export const getProfile = async (name: string) => {
    try {
        const request = await fetch(GATEWAY_VIEW + name);

        const data: ProfileResponse = await request.json();

        return data;
    } catch {
        console.log('Failed to load from ccip gateway');
    }

    const data = await getEnstate(name);

    if (!data) return;

    data.records['avatar'] = data.avatar;
    data.chains['60'] = data.chains['eth'];

    return { ...data, records: data.records, addresses: data.chains };
};

type ProfileDataPost = {
    name: string;
    records: Record<string, string>;
    addresses: Record<string, string>;
    auth: 'yes';
};

const postUpdateProfile = async (name: string, data: ProfileDataPost) => {
    const request = await fetch(GATEWAY_UPDATE, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await request.text();

    console.log({ response });
};

export const Profile: FC<{ name: string }> = ({ name }) => {
    const { data } = useSWR(name, getProfile);
    const { address } = useAccount();

    const { data: ensResolver, isSuccess: isEnsResolverFinished } =
        useEnsResolver({ name });
    const { data: ownerData } = useContractRead({
        address: ENS_MAINNET_REGISTRY,
        abi: [
            {
                type: 'function',
                name: 'owner',
                stateMutability: 'view',
                inputs: [
                    {
                        type: 'bytes32',
                        name: 'node',
                    },
                ],
                outputs: [
                    {
                        type: 'address',
                        name: 'owner',
                    },
                ],
            },
        ],
        functionName: 'owner',
        args: [namehash(name)],
    });

    const isUsingOffchainResolver =
        ensResolver?.toLowerCase() ===
        '0xdCcB68ac05BB2Ee83F0873DCd0BF5F57E2968344'.toLowerCase();
    const canChangeResolver =
        ownerData?.toString().toLowerCase() === address?.toLowerCase();
    const isOwner = data?.addresses[60] == address;
    const editable = address && data && isUsingOffchainResolver && isOwner;

    const shouldSuggestGassless =
        isEnsResolverFinished &&
        !isUsingOffchainResolver &&
        isOwner &&
        canChangeResolver;

    const mutateProfile = () => {
        postUpdateProfile(name, {
            name: name,
            records: {
                ...data.records,
                'com.discord': 'lucemans',
            },
            addresses: data.addresses,
            auth: 'yes',
        });
    };

    if (!data) return <div>Loading...</div>;

    return (
        <Layout>
            <div className="px-4">
                <span className="block font-bold text-3xl">
                    {name.split('.')[0]}
                </span>
                <span className="block text-xl">
                    .{name.split('.').slice(1).join('.')}
                </span>
            </div>
            <div className="relative flex flex-col items-center gap-4 p-4 card">
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
                        {editable && (
                            <div className="right-1 bottom-1 absolute w-14 h-14 rounded-full bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent flex items-center justify-center">
                                <img
                                    src="/pencil.svg"
                                    alt="pencil"
                                    className="h-[1em] fill-ens-light-text-accent"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Field
                        label="Display Name"
                        record="name"
                        value={data.records['name']}
                        editable={editable}
                    />
                    <Field
                        label="Website"
                        record="url"
                        value={data.records['url']}
                        editable={editable}
                    />
                    <Field
                        label="X"
                        record="com.twitter"
                        value={data.records['com.twitter']}
                        editable={editable}
                    />
                    <Field
                        label="Telegram"
                        record="org.telegram"
                        value={data.records['org.telegram']}
                        editable={editable}
                    />
                    <Field
                        label="Discord"
                        record="com.discord"
                        value={data.records['com.discord']}
                        editable={editable}
                    />
                    <Field
                        label="Github"
                        record="com.github"
                        value={data.records['com.github']}
                        editable={editable}
                    />
                    {DEVELOPER_MODE && (
                        <Field
                            label="Resolver"
                            record="resolver"
                            editable={false}
                            value={ensResolver ?? '...'}
                        />
                    )}
                    {DEVELOPER_MODE && ownerData && (
                        <Field
                            label="Owner"
                            record="owner"
                            editable={false}
                            value={ownerData.toString()}
                        />
                    )}
                </div>
                {editable && (
                    <FloatingButton>
                        <button
                            className="btn btn-primary btn-pad btn-full"
                            onClick={() => mutateProfile()}
                        >
                            Update profile
                        </button>
                    </FloatingButton>
                )}
                {shouldSuggestGassless && (
                    <FloatingButton>
                        <GoGassless name={name} />
                    </FloatingButton>
                )}
            </div>
        </Layout>
    );
};

export const FloatingButton: FC<PropsWithChildren<{}>> = ({ children }) => (
    <div className="fixed md:relative bottom-0 inset-x-0 w-full">
        <div className="relative w-full flex justify-center p-3 md:p-0">
            <div className="z-10 w-full max-w-2xs md:max-w-full mx-auto ">
                {children}
            </div>
            <div className="md:hidden bg-gradient-to-t from-black/20 to-black/0 absolute inset-0"></div>
        </div>
    </div>
);
