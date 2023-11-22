import { FC } from 'react';

export const Field: FC<{ label: string; record: string; value: string }> = ({
    label,
    record,
    value,
}) => {
    return (
        <div className="">
            <label className="font-bold text-sm pl-2 py-1 block">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    P
                </div>
                <input
                    className="border bg-ens-light-background-primary dark:bg-ens-dark-background-primary border-ens-light-border dark:border-ens-dark-border pl-8 rounded-md py-2 w-full"
                    placeholder="Dom"
                    value={value}
                />
            </div>
        </div>
    );
};
