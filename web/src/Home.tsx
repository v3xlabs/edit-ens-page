import { clsx } from 'clsx';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { Layout } from './Layout';

export const Home = () => {
    const [name, setName] = useState('');

    return (
        <Layout>
            <div className="card p-4 space-y-3">
                <div>Search Name</div>
                <div className="relative">
                    <div className="w-4 flex items-center justify-center left-3 top-1/2 absolute -translate-y-1/2">
                        <FiSearch />
                    </div>
                    <input
                        type="text"
                        className="input"
                        placeholder="luc.eth"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    />
                </div>
                <a
                    href={'/' + name}
                    className={clsx(
                        'block text-center btn btn-pad btn-full',
                        name.length > 0 ? 'btn-primary' : 'btn-disabled'
                    )}
                    aria-disabled={name.length === 0}
                >
                    Go
                </a>
            </div>
        </Layout>
    );
};
