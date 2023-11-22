import { FiGithub } from 'react-icons/fi';

export const Footer = () => {
    return (
        <div className="min-h-[10rem] w-full">
            <div className="text-center flex justify-center center gap-1 items-center">
                <a href="https://ens.app" target="_blank">
                    ENS
                </a>
                |
                <a href="https://v3x.company" target="_blank">
                    V3X
                </a>
                |
                <a
                    href="https://github.com/ensdomains/offchain-gateway-rs"
                    target="_blank"
                >
                    <FiGithub />
                </a>
            </div>
        </div>
    );
};
