import { FC } from 'react';

import { Dialog } from '../../dialog/Dialog';

export const AvatarSetFlow: FC<{ name: string; onClose: () => void }> = ({
    name,
    onClose,
}) => {
    return (
        <>
            <Dialog onClose={onClose}>
                <div className="flex flex-col gap-2">
                    <div className="text-sm">Changing Avatar</div>
                    <button
                        className="btn btn-primary btn-pad btn-full"
                        onClick={() => {
                            // TODO: Implement NFT Selection
                        }}
                    >
                        Choose an NFT
                    </button>
                    <button
                        className="btn btn-primary btn-pad btn-full"
                        onClick={() => {
                            // TODO: Implement Image Upload
                        }}
                    >
                        Upload an image
                    </button>
                    <button
                        className="btn btn-primary btn-pad btn-full"
                        onClick={() => {
                            // TODO: Open Menu
                        }}
                    >
                        Enter Manually
                    </button>
                    <button
                        className="btn btn-secondary btn-pad btn-full"
                        onClick={() => {
                            // TODO: Set avatar to null
                        }}
                    >
                        Remove
                    </button>
                    <button
                        className="btn btn-secondary btn-pad btn-full"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </Dialog>
        </>
    );
};
