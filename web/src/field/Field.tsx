import { BrowserSVG, PersonSVG } from '@ensdomains/thorin';
import { FC, ReactNode } from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { FaDiscord, FaGithub, FaTelegramPlane } from 'react-icons/fa';

const field_record_to_icon: Record<string, ReactNode> = {
    'com.twitter': <BsTwitterX />,
    'org.telegram': <FaTelegramPlane />,
    name: <PersonSVG />,
    url: <BrowserSVG />,
    'com.discord': <FaDiscord />,
    'com.github': <FaGithub />,
};

const field_placeholders: Record<string, string> = {
    'com.twitter': '@lucemansnl',
    'com.github': 'lucemans',
    avatar: 'ipfs://bafkreifnrjhkl7ccr2ifwn2n7ap6dh2way25a6w5x2szegvj5pt4b5nvfu',
    'org.telegram': 'lucemans',
    'com.discord': 'lucemans',
    name: 'Luc',
    url: 'https://example.com',
};

export const Field: FC<{ label: string; record: string; value: string }> = ({
    label,
    record,
    value,
}) => {
    const field_icon = field_record_to_icon[record];
    const field_placeholder = field_placeholders[record];

    return (
        <div className="">
            <label className="font-bold text-sm pl-2 py-1 block">{label}</label>
            <div className="relative">
                <div className="w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2">
                    {field_icon}
                </div>
                <input
                    className="border bg-ens-light-background-primary dark:bg-ens-dark-background-primary border-ens-light-border dark:border-ens-dark-border pl-9 rounded-md py-2 w-full"
                    placeholder={field_placeholder}
                    value={value}
                />
            </div>
        </div>
    );
};
