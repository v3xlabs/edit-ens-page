/* eslint-disable unicorn/prefer-object-from-entries */
import { clsx } from 'clsx';
import { FC, PropsWithChildren, useState } from 'react';
import useSWR from 'swr';
import { namehash } from 'viem';
import {
    useAccount,
    useContractRead,
    useEnsResolver,
    useSignMessage,
} from 'wagmi';

import { DEVELOPER_MODE } from './App';
import { Field } from './field/Field';
import { AvatarSetFlow } from './flows/avatar/AvatarSetFlow';
import { Footer } from './footer/Footer';
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
    display: string;
    avatar: string;
    header: string;
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

        return {
            ...data,
            display:
                data.records['display'].toLowerCase() == name
                    ? data.records['display']
                    : undefined,
            chains: data.addresses,
        };
    } catch {
        console.log('Failed to load from ccip gateway');
    }

    const data = await getEnstate(name);

    if (!data) return;

    data.records['header'] = data.header;
    data.records['avatar'] = data.avatar;
    data.chains['60'] = data.chains['eth'];

    return data;

    // return {
    //     ...data,
    //     display: data.display,
    //     records: data.records,
    //     addresses: data.chains,
    // };
};

const postUpdateProfile = async (
    name: string,
    data: string,
    signature: string
) => {
    const request = await fetch(GATEWAY_UPDATE, {
        method: 'POST',
        body: JSON.stringify({
            payload: data,
            auth: signature,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await request.text();

    console.log({ response });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
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
    const isOwner = data?.chains[60] == address;
    const editable = address && data && isUsingOffchainResolver && isOwner;

    const shouldSuggestGassless =
        isEnsResolverFinished &&
        !isUsingOffchainResolver &&
        isOwner &&
        canChangeResolver;

    const newPayload = {
        records: {
            name: 'v3x.eth',
            avatar: 'https://gateway.pinata.cloud/ipfs/QmVQaX2H1v6Qc7z3j7KQq6Q8Y8X4iCqYQ2V1xZJ6JkqL6Z',
            url: 'https://v3x.eth.link',
            'com.twitter': 'v3x.eth',
            'org.telegram': 'v3x.eth',
            'com.discord': 'v3x.eth',
            'com.github': 'v3x.eth',
        },
        addresses: {
            '60': '0x225f137127d9067788314bc7fcc1f36746a3c3B5',
        },
    };

    const payload = {
        name,
        records: newPayload.records,
        addresses: newPayload.addresses,
        time: Date.now(),
    };
    const message = JSON.stringify(payload);

    const { signMessageAsync } = useSignMessage({
        message,
    });

    const mutateProfile = async () => {
        console.log('signing message');
        // @ts-ignore
        const x = await signMessageAsync();

        console.log('sending message');
        await postUpdateProfile(name, message, x);
    };

    const [startAvatarFlow, setStartAvatarFlow] = useState(false);

    const hasChanges = true;

    if (!data) return <div>Loading...</div>;

    const display_name = data?.display ?? data?.name;
    const name_split = display_name.split('.');
    const first_half = name_split.length > 2 ? name_split[0] : display_name;
    const second_half =
        name_split.length > 2 ? name_split.slice(1).join('.') : undefined;

    return (
        <Layout>
            <div className="px-4">
                <span className="block font-bold text-3xl">{first_half}</span>
                {second_half && (
                    <span className="block text-xl">.{second_half}</span>
                )}
            </div>
            <div className="relative flex flex-col items-center card">
                <div className="w-full">
                    <div className="relative w-full aspect-[3/1] overflow-hidden rounded-t-2xl">
                        <div className="absolute inset-0 w-full h-full bg-ens-light-background-secondary"></div>
                        {data?.records['header'] && (
                            <img
                                src={'https://enstate.rs/h/' + data.name}
                                alt="banner"
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        )}
                        {editable && (
                            <div className="right-1 bottom-1 absolute w-8 h-8 rounded-lg bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent flex items-center justify-center">
                                <img
                                    src="/pencil.svg"
                                    alt="pencil"
                                    className="h-[1em] fill-ens-light-text-accent"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center -mt-20">
                        <div className="relative aspect-square h-32 w-32">
                            <div className="aspect-square h-32 overflow-hidden w-32 rounded-full drop-shadow-md bg-ens-light-background-secondary dark:bg-ens-dark-background-secondary">
                                <div
                                    className="w-full h-full"
                                    style={{
                                        background:
                                            'linear-gradient(323deg, #DE82FF -15.56%, #7F6AFF 108.43%)',
                                    }}
                                >
                                    {data.records['avatar'] && (
                                        <img
                                            src={
                                                'https://enstate.rs/i/' +
                                                data.name
                                            }
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                            {editable && (
                                <button
                                    onClick={() => {
                                        setStartAvatarFlow(true);
                                    }}
                                    className="right-1 bottom-1 absolute w-14 h-14 rounded-full bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent flex items-center justify-center"
                                >
                                    <img
                                        src="/pencil.svg"
                                        alt="pencil"
                                        className="h-[1em] fill-ens-light-text-accent"
                                    />
                                </button>
                            )}
                            {startAvatarFlow && (
                                <AvatarSetFlow
                                    name={name}
                                    onClose={() => {
                                        setStartAvatarFlow(false);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4 w-full space-y-4">
                    <div className="w-full flex flex-col gap-2">
                        <Field
                            label="Display Name"
                            record="name"
                            value={data.records['name']}
                            editable={editable}
                        />
                        <Field
                            label="Pronouns"
                            record="pronouns"
                            value={data.records['pronouns']}
                            editable={editable}
                        />
                        <Field
                            label="Description"
                            record="description"
                            value={data.records['description']}
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
                            label="Timezone"
                            record="timezone"
                            value={data.records['timezone']}
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
                        {
                            // Chains
                            [
                                ['60', 'eth', 'Ethereum Address'],
                                ['0', 'btc', 'Bitcoin Address'],
                                ['2147483785', 'polygon', 'Polygon Address'],
                                ['2147483658', 'optimism', 'Optimism Address'],
                                ['2148018000', 'scroll', 'Scroll Address'],
                            ].map(([chainId, chainName, chainLabel]) => (
                                <Field
                                    key={chainId}
                                    label={chainLabel}
                                    record={chainId.toString()}
                                    value={
                                        data?.chains[chainId.toString()] ??
                                        data?.chains[chainName]
                                    }
                                    editable={editable}
                                />
                            ))
                        }
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
                                className={clsx(
                                    'btn btn-pad btn-full',
                                    hasChanges ? 'btn-primary' : 'btn-disabled'
                                )}
                                onClick={() => {
                                    mutateProfile();
                                    // hasChanges && mutateProfile();
                                }}
                                disabled={!hasChanges}
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
            </div>
            <Footer />
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
