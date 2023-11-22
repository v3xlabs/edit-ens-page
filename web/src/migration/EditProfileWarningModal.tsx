import { FC } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export const EditProfileWarningModal: FC<{
    name: string;
    onClose: () => void;
}> = ({ name, onClose }) => {
    return (
        <div>
            <div className="fixed z-10 inset-0 bg-white/10 backdrop-blur-md"></div>
            <div className="fixed z-20 inset-x-0 bottom-0 md:inset-0 flex items-center justify-center">
                <div className="relative bg-ens-light-background-primary dark:bg-ens-dark-background-primary p-4 rounded-t-xl md:rounded-b-xl shadow-xl max-w-md border border-ens-light-border dark:border-ens-dark-border">
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="absolute top-4 right-4"
                    >
                        <FiX />
                    </button>
                    <div className="p-4 space-y-2">
                        <div className="w-8 h-8 p-2 rounded-full bg-ens-light-yellow-primary dark:bg-ens-dark-yellow-primary mx-auto flex items-center justify-center">
                            <FiAlertTriangle stroke="#fff" />
                        </div>
                        <div className="font-bold text-center">
                            You are about to set your resolver
                        </div>
                        <p className="text-center">
                            Keep in mind, anything you add to your profile will
                            be publically viewable on the blockchain.
                        </p>
                    </div>
                    <div className="gap-2 flex flex-col">
                        <button
                            onClick={() => {
                                onClose();
                            }}
                            className="btn btn-secondary btn-full"
                        >
                            Back
                        </button>
                        <button className="btn btn-primary btn-full">
                            Update Resolver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
