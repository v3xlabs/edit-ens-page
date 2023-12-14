import { BrowserSVG, CrossCircleSVG, PersonSVG } from '@ensdomains/thorin';
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
            <label className="block py-1 pl-2 text-sm font-bold">{label}</label>
            <div className="relative">
                <div className="absolute flex items-center justify-center w-4 -translate-y-1/2 left-3 top-1/2">
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
export const SingleField: FC<{
    label: string;
    editable: boolean;
    register: UseFormRegisterReturn<string>;
    icon?: ReactNode;
    placeholder?: string;
    hidden?: boolean;
    modified?: boolean;
    defaultValue?: string;
    onDelete?: () => void;
    deletable?: boolean;
}> = ({
    label,
    editable,
    register,
    icon,
    placeholder,
    hidden,
    modified,
    defaultValue,
    onDelete,
    deletable,
}) => {
    if (hidden)
        return (
            <input
                className="input"
                placeholder={placeholder}
                readOnly={!editable}
                hidden={hidden}
                {...register}
            />
        );

    return (
        <div className="">
            <label className={'font-bold text-sm pl-2 py-1 block'}>
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div
                        className={
                            'w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2'
                        }
                    >
                        {icon}
                    </div>
                )}
                <input
                    className={'input'}
                    placeholder={placeholder}
                    readOnly={!editable}
                    hidden={hidden}
                    defaultValue={defaultValue}
                    {...register}
                />
                {modified && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-white rounded-full bg-ens-light-green-primary"></div>
                    </div>
                )}
                {editable && onDelete && deletable && (
                    <button
                        className="absolute top-0 bottom-0 right-0 h-full aspect-square text-ens-light-text-secondary"
                        onClick={onDelete}
                    >
                        <CrossCircleSVG className="mx-auto" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Temp Comp for new field
export const DoubleField: FC<{
    label: string;
    editable: boolean;
    primaryRegister: UseFormRegisterReturn<string>;
    secondaryRegister: UseFormRegisterReturn<string>;
    icon?: ReactNode;
    placeholder?: string;
    modified?: boolean;
    onDelete?: () => void;
    error: { primary: boolean; secondary: boolean };
}> = ({
    label,
    editable,
    primaryRegister,
    secondaryRegister,
    icon,
    placeholder,
    modified,
    onDelete,
    error,
}) => {
    return (
        <div className="">
            <label className={'font-bold text-sm pl-2 py-1 block'}>
                {label}
            </label>
            <div className="relative flex space-x-4">
                {icon && (
                    <div
                        className={
                            'w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2'
                        }
                    >
                        {icon}
                    </div>
                )}
                <input
                    className={`input !w-1/3 ${!icon && '!pl-3'} ${
                        error.primary && 'border-red-500'
                    }`}
                    placeholder={placeholder}
                    readOnly={!editable}
                    {...primaryRegister}
                />
                <input
                    className={`input !w-2/3 ${!icon && '!pl-3'} ${
                        error.secondary && 'border-red-500'
                    }`}
                    placeholder={placeholder}
                    readOnly={!editable}
                    {...secondaryRegister}
                />
                {modified && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-white rounded-full bg-ens-light-green-primary"></div>
                    </div>
                )}
                {editable && onDelete && (
                    <button
                        className="absolute top-0 bottom-0 right-0 h-full aspect-square text-ens-light-text-secondary"
                        onClick={onDelete}
                    >
                        <CrossCircleSVG className="mx-auto" />
                    </button>
                )}
            </div>
        </div>
    );
};
