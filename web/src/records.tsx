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
import {
    FiAlignJustify,
    FiClock,
    FiGlobe,
    FiMail,
    FiMapPin,
} from 'react-icons/fi';

export type EnsRecordBase = {
    hidden?: boolean;
} & (
    | {
          type: 'recommended' | 'supported';
          pattern?: string;
          label?: string;
          icon?: ReactNode;
          placeholder?: string;
      }
    | {
          type: 'arbitrary';
          pattern?: undefined;
          label?: undefined;
          icon?: undefined;
          placeholder?: undefined;
      }
);

export type EnsRecord =
    // EnsRecordBase &
    {
        record: string;
        value: string;
    };

export type EnsRecords = Record<string, EnsRecordBase>;

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
        placeholder: 'they/them',
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
    email: {
        type: 'recommended',
        label: 'Email',
        icon: <FiMail />,
    },
    timezone: {
        type: 'recommended',
        label: 'Timezone',
        icon: <FiClock />,
    },
    location: {
        type: 'recommended',
        label: 'Location',
        icon: <FiMapPin />,
    },
    'com.twitter': {
        type: 'supported',
        label: 'X',
        icon: <BsTwitterX />,
    },
    'org.telegram': {
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

export type Chain = {
    label: string;
    icon?: ReactNode;
};

export type Chains = Record<string, Chain>;

export const SupportedChains: EnsRecords = {
    '60': {
        type: 'recommended',
        label: 'Ethereum',
        icon: <FaEthereum />,
    },
    '0': {
        type: 'supported',
        label: 'Bitcoin',
        icon: <FaBitcoin />,
    },
    '2147483785': {
        type: 'supported',
        label: 'Polygon',
        icon: <FaDrawPolygon />,
    },
    '2147483658': {
        type: 'supported',
        label: 'Optimism',
        icon: <FiGlobe />,
    },
    '2148018000': {
        type: 'supported',
        label: 'Scroll',
        icon: <FaScroll />,
    },
};
