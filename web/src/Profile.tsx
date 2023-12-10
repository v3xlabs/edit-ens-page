/* eslint-disable unicorn/prefer-object-from-entries */
import { clsx } from 'clsx';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { namehash } from 'viem';
import {
    useAccount,
    useContractRead,
    useEnsResolver,
    useSignMessage,
} from 'wagmi';

import { DoubleField, SingleField } from './field/Field';
import { AvatarSetFlow } from './flows/avatar/AvatarSetFlow';
import { Footer } from './footer/Footer';
import { Layout } from './Layout';
import { GoGassless } from './migration/GoGassless';
import {
    EnsRecord,
    EnsRecordBase,
    SupportedChains,
    SupportedRecords,
} from './records';

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
                data.records['display']?.toLowerCase() == name
                    ? data.records['display']
                    : undefined,
            chains: data.addresses,
        };
    } catch (error) {
        console.log('Failed to load from ccip gateway', error);
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

type ProfileForm = {
    // records: Record<string, { value: string }>;
    // chains: Record<string, string>;
    records: EnsRecord[];
    chains: EnsRecord[];
};

const useDefaultValues = (
    data:
        | (Omit<ProfileResponse, 'addresses'> & {
              display?: string;
              chains: Record<string, string>;
          })
        | undefined,
    editable: boolean | undefined
) => {
    const [defaultValues, setDefaultValues] = useState<
        ProfileForm | undefined
    >();

    useEffect(() => {
        if (!data || defaultValues || editable === undefined) return;

        const newDefaultValues: ProfileForm = {
            records: [],
            chains: [],
        };

        if (editable) {
            // ====================
            // Records
            // ====================

            // Make sure all recommended records are in the form
            for (const [record, supportedRecord] of Object.entries(
                SupportedRecords
            )) {
                if (supportedRecord.type === 'recommended') {
                    newDefaultValues.records.push({
                        // ...supportedRecord,
                        record,
                        value: data.records[record] ?? '',
                    });
                }
            }

            // Add the rest of the records from the profile
            for (const [record, value] of Object.entries(data.records)) {
                const supportedRecord = SupportedRecords[record];

                if (supportedRecord?.type === 'recommended') continue;

                newDefaultValues.records.push({
                    record,
                    value,
                });
            }

            // ====================
            // Chains
            // ====================

            // Make sure all recommended chains are in the form
            for (const [chain, supportedChain] of Object.entries(
                SupportedChains
            )) {
                if (supportedChain.type === 'recommended') {
                    newDefaultValues.chains.push({
                        record: chain,
                        value: data.chains[chain] ?? '',
                    });
                }
            }

            // Add the rest of the chains from the profile
            for (const [chain, value] of Object.entries(data.chains)) {
                const supportedChain = SupportedChains[chain];

                if (supportedChain?.type === 'recommended') continue;

                newDefaultValues.chains.push({
                    record: chain,
                    value,
                });
            }
        } else {
            // ====================
            // Records
            // ====================

            // Add all records from the profile
            for (const [record, value] of Object.entries(data.records)) {
                newDefaultValues.records.push({
                    record,
                    value,
                });
            }

            // ====================
            // Chains
            // ====================
            // Add all chains from the profile
            for (const [chain, value] of Object.entries(data.chains)) {
                newDefaultValues.chains.push({
                    record: chain,
                    value,
                });
            }
        }

        setDefaultValues(newDefaultValues);
    }, [data, editable]);

    return defaultValues;
};

const ProfileRecordsSection: FC<{
    data: Omit<ProfileResponse, 'addresses'> & {
        display?: string;
        chains: Record<string, string>;
    };
    initialDefaultValues?: ProfileForm;
    editable: boolean;
    ownerData?: unknown;
    ensResolver?: string;
    shouldSuggestGassless?: boolean;
    submitHandler: SubmitHandler<ProfileForm>;
}> = ({
    data,
    initialDefaultValues,
    editable,
    ownerData,
    ensResolver,
    shouldSuggestGassless,
    submitHandler,
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { isDirty, dirtyFields },
    } = useForm({
        defaultValues: initialDefaultValues,
    });

    const {
        fields: recordFields,
        append: appendRecord,
        remove: removeRecord,
    } = useFieldArray({
        control,
        name: 'records',
    });

    const {
        fields: chainFields,
        append: appendChain,
        remove: removeChain,
    } = useFieldArray({
        control,
        name: 'chains',
    });

    return (
        <form
            className="w-full p-4 space-y-4"
            onSubmit={handleSubmit(submitHandler)}
        >
            <div className="flex flex-col w-full gap-2">
                {recordFields.map((field, index) => {
                    const { record, id, value } = field;

                    const supportedRecord: EnsRecordBase | undefined =
                        SupportedRecords[record];

                    return supportedRecord ? (
                        <SingleField
                            key={id}
                            label={supportedRecord.label ?? record}
                            icon={supportedRecord.icon}
                            placeholder={supportedRecord.placeholder}
                            hidden={supportedRecord.hidden}
                            editable={editable}
                            register={register(`records.${index}.value`)}
                            modified={
                                dirtyFields.records &&
                                dirtyFields.records[index]?.value
                            }
                            onDelete={() => {
                                removeRecord(index);
                            }}
                            defaultValue={value}
                        />
                    ) : (
                        <DoubleField
                            key={id}
                            label={'Custom'}
                            editable={editable}
                            primaryRegister={register(
                                `records.${index}.record`
                            )}
                            secondaryRegister={register(
                                `records.${index}.value`
                            )}
                            modified={
                                dirtyFields.records &&
                                (dirtyFields.records[index]?.value ||
                                    dirtyFields.records[index]?.record)
                            }
                            onDelete={() => {
                                removeRecord(index);
                            }}
                        />
                    );
                })}

                {chainFields.map((field, index) => {
                    const { record, id, value } = field;

                    const supportedChain: EnsRecordBase | undefined =
                        SupportedChains[record];

                    return supportedChain ? (
                        <SingleField
                            key={id}
                            label={supportedChain.label ?? record}
                            icon={supportedChain.icon}
                            placeholder={supportedChain.placeholder}
                            hidden={supportedChain.hidden}
                            editable={editable}
                            register={register(`chains.${index}.value`)}
                            modified={
                                dirtyFields.chains &&
                                dirtyFields.chains[index]?.value
                            }
                            onDelete={() => {
                                removeChain(index);
                            }}
                            defaultValue={value}
                        />
                    ) : (
                        <DoubleField
                            key={id}
                            label={'Custom'}
                            editable={editable}
                            primaryRegister={register(`chains.${index}.record`)}
                            secondaryRegister={register(
                                `chains.${index}.value`
                            )}
                            modified={
                                dirtyFields.chains &&
                                (dirtyFields.chains[index]?.value ||
                                    dirtyFields.chains[index]?.record)
                            }
                            onDelete={() => {
                                removeChain(index);
                            }}
                        />
                    );
                })}
                {/* {DEVELOPER_MODE && (
                    <FieldNew
                        label="Resolver"
                        record="resolver"
                        editable={false}
                        register={register('records.resolver')}
                    />
                )}
                {DEVELOPER_MODE && ownerData && (
                    <FieldNew
                        label="Owner"
                        record="owner"
                        register={register('records.owner')}
                        editable={false}
                    />
                )} */}
            </div>

            {editable && (
                <FloatingButton>
                    <div className="flex space-x-4">
                        <button
                            className={clsx(
                                'btn btn-pad btn-full',
                                'btn-secondary'
                            )}
                            onClick={(event) => {
                                event.preventDefault();

                                appendRecord({
                                    record: '',
                                    value: '',
                                });
                            }}
                        >
                            Add record
                        </button>
                        <button
                            className={clsx(
                                'btn btn-pad btn-full',
                                'btn-secondary'
                            )}
                            onClick={(event) => {
                                event.preventDefault();

                                appendChain({
                                    record: '',
                                    value: '',
                                });
                            }}
                        >
                            Add Chain
                        </button>
                    </div>
                </FloatingButton>
            )}
            {editable && (
                <FloatingButton>
                    <button
                        className={clsx(
                            'btn btn-pad btn-full',
                            isDirty ? 'btn-primary' : 'btn-disabled'
                        )}
                        disabled={!isDirty}
                    >
                        Update profile
                    </button>
                </FloatingButton>
            )}
            {shouldSuggestGassless && (
                <FloatingButton>
                    <GoGassless name={data.name} />
                </FloatingButton>
            )}
        </form>
    );
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

    const isUsingOffchainResolver = ensResolver
        ? ensResolver.toLowerCase() ===
          '0xdCcB68ac05BB2Ee83F0873DCd0BF5F57E2968344'.toLowerCase()
        : undefined;
    const canChangeResolver =
        ownerData?.toString().toLowerCase() === address?.toLowerCase();
    const isOwner = data?.chains[60] == address;

    const editable = !!address && data && isUsingOffchainResolver && isOwner;

    const shouldSuggestGassless =
        isEnsResolverFinished &&
        !isUsingOffchainResolver &&
        isOwner &&
        canChangeResolver;

    const { signMessageAsync } = useSignMessage();

    const mutateProfile: SubmitHandler<ProfileForm> = async (data) => {
        const payload = {
            name,
            // Remove all records whose value is empty
            records: Object.fromEntries(
                data.records
                    .filter((record) => record.value !== '')
                    .map((record) => [record.record, record.value])
            ),
            addresses: Object.fromEntries(
                data.chains
                    .filter((chain) => chain.value !== '')
                    .map((chain) => [chain.record, chain.value])
            ),
            // addresses: {},
            time: Date.now(),
        };

        const message = JSON.stringify(payload);

        console.log('signing message', message);
        const x = await signMessageAsync({ message });

        console.log('sending message');
        await postUpdateProfile(name, message, x);
    };

    const [startAvatarFlow, setStartAvatarFlow] = useState(false);

    const initialDefaultValues = useDefaultValues(data, editable);

    if (!data || !initialDefaultValues || !ensResolver)
        return <div>Loading...</div>;

    const display_name = data?.display ?? data?.name;
    const name_split = display_name.split('.');
    const first_half = name_split.length > 2 ? name_split[0] : display_name;
    const second_half =
        name_split.length > 2 ? name_split.slice(1).join('.') : undefined;

    return (
        <Layout>
            <div className="px-4">
                <span className="block text-3xl font-bold">{first_half}</span>
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
                                className="absolute inset-0 object-cover w-full h-full"
                            />
                        )}
                        {editable && (
                            <div className="absolute flex items-center justify-center w-8 h-8 rounded-lg right-1 bottom-1 bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent">
                                <img
                                    src="/pencil.svg"
                                    alt="pencil"
                                    className="h-[1em] fill-ens-light-text-accent"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center -mt-20">
                        <div className="relative w-32 h-32 aspect-square">
                            <div className="w-32 h-32 overflow-hidden rounded-full aspect-square drop-shadow-md bg-ens-light-background-secondary dark:bg-ens-dark-background-secondary">
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
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>
                            {editable && (
                                <button
                                    onClick={() => {
                                        setStartAvatarFlow(true);
                                    }}
                                    className="absolute flex items-center justify-center rounded-full right-1 bottom-1 w-14 h-14 bg-ens-light-blue-primary dark:bg-ens-dark-blue-primary text-ens-light-text-accent dark:text-ens-dark-text-accent"
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
                {/* record inputs */}
                <ProfileRecordsSection
                    data={data}
                    initialDefaultValues={initialDefaultValues}
                    editable={editable ?? false}
                    ownerData={ownerData}
                    ensResolver={ensResolver}
                    shouldSuggestGassless={shouldSuggestGassless}
                    submitHandler={mutateProfile}
                />
            </div>
            <Footer />
        </Layout>
    );
};

export const FloatingButton: FC<PropsWithChildren<{}>> = ({ children }) => (
    <div className="fixed inset-x-0 bottom-0 w-full md:relative">
        <div className="relative flex justify-center w-full p-3 md:p-0">
            <div className="z-10 w-full mx-auto max-w-2xs md:max-w-full ">
                {children}
            </div>
            <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/20 to-black/0"></div>
        </div>
    </div>
);
