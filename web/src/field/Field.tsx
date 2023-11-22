import { BrowserSVG, PersonSVG } from '@ensdomains/thorin';
import { FC, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { BsTwitterX } from 'react-icons/bs';
import {
    FaBitcoin,
    FaDiscord,
    FaDrawPolygon,
    FaEthereum,
    FaGithub,
    FaScroll,
    FaTelegramPlane,
} from 'react-icons/fa';
import { FiAlignJustify, FiClock, FiGlobe } from 'react-icons/fi';

import { EnsRecord } from '../records.js';

const field_record_to_icon: Record<string, ReactNode> = {
    'com.twitter': <BsTwitterX />,
    'org.telegram': <FaTelegramPlane />,
    name: <PersonSVG />,
    url: <BrowserSVG />,
    'com.discord': <FaDiscord />,
    'com.github': <FaGithub />,
    description: <FiAlignJustify />,
    timezone: <FiClock />,
    '60': <FaEthereum />,
    '2147483785': <FaDrawPolygon />, // Polygon
    '2147483658': <FiGlobe />, // Optimism
    '2148018000': <FaScroll />, // Scroll
    '0': <FaBitcoin />,
};

const field_placeholders: Record<string, string> = {
    'com.twitter': '@lucemansnl',
    'com.github': 'lucemans',
    avatar: 'ipfs://bafkreifnrjhkl7ccr2ifwn2n7ap6dh2way25a6w5x2szegvj5pt4b5nvfu',
    'org.telegram': 'lucemans',
    'com.discord': 'lucemans',
    name: 'Luc',
    description: 'this is my description',
    url: 'https://example.com',
    pronouns: 'they/them',
    timezone: 'Europe/Amsterdam',
};

export const Field: FC<{
    label: string;
    record: string;
    value: string;
    editable: boolean;
    register?: UseFormRegisterReturn<string>;
}> = ({ label, record, value, editable, register }) => {
    const field_icon = field_record_to_icon[record];
    const field_placeholder = field_placeholders[record];

    // hide empty fields
    if (!editable && !value) return;

    return (
        <div className="">
            <label className="font-bold text-sm pl-2 py-1 block">{label}</label>
            <div className="relative">
                <div className="w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2">
                    {field_icon}
                </div>
                <input
                    className="input"
                    placeholder={field_placeholder}
                    value={value}
                    readOnly={!editable}
                    {...register}
                />
            </div>
        </div>
    );
};

// Temp Comp for new field
export const FieldNew: FC<{
    record: EnsRecord;
    editable: boolean;
    register?: UseFormRegisterReturn<string>;
}> = ({ record, editable, register }) => {
    const field_placeholder = field_placeholders[record.record];

    // hide empty fields
    if ((!editable && !record.value) || record.hidden) return;

    return (
        <div className="">
            <label className="font-bold text-sm pl-2 py-1 block">
                {record.label ? record.label : record.record}
            </label>
            <div className="relative">
                <div className="w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2">
                    {record.icon}
                </div>
                <input
                    className="input"
                    placeholder={field_placeholder}
                    value={record.value}
                    readOnly={!editable}
                    {...register}
                />
            </div>
        </div>
    );
};
