import { BrowserSVG, PersonSVG } from '@ensdomains/thorin';
import { ReactNode } from 'react';
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

export type EnsRecordBase = {
    hidden?: boolean;
} & (
    | {
          type: 'recommended' | 'supported';
          pattern?: string;
          label?: string;
          icon?: ReactNode;
      }
    | {
          type: 'arbitrary';
          pattern?: undefined;
          label?: undefined;
          icon?: undefined;
      }
);

export type EnsRecord = EnsRecordBase & {
    record: string;
    value: string;
};

export const SupportedRecords: Record<string, EnsRecordBase> = {
    name: {
        type: 'recommended',
        label: 'Display Name',
        icon: <PersonSVG />,
    },
    avatar: {
        type: 'recommended',
        label: 'Avatar',
        hidden: true,
        // pattern: 'image/*',
    },
    pronouns: {
        type: 'recommended',
        label: 'Pronouns',
        icon: <FiAlignJustify />,
    },
    description: {
        type: 'recommended',
        label: 'Description',
        icon: <FiAlignJustify />,
    },
    url: {
        type: 'recommended',
        // pattern: 'https://*',
        label: 'Website',
        icon: <BrowserSVG />,
    },
    'com.twitter': {
        type: 'supported',
        label: 'X',
        icon: <BsTwitterX />,
    },
    'com.telegram': {
        type: 'supported',
        label: 'Telegram',
        icon: <FaTelegramPlane />,
    },
    'com.discord': {
        type: 'supported',
        label: 'Discord',
        icon: <FaDiscord />,
    },
    'com.github': {
        type: 'supported',
        label: 'Github',
        icon: <FaGithub />,
    },
};
