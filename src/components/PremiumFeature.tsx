import React, { useState } from 'react';
import { useAuth } from '../context/RigelAuth.tsx';
import { PaywallModal } from './ui/PaywallModal.tsx';

interface PremiumFeatureProps {
    children: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children }) => {
    const { hasPremiumAccess } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickWrapper = (e: React.MouseEvent) => {
        if (!hasPremiumAccess) {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div onClickCapture={handleClickWrapper} className={!hasPremiumAccess ? "cursor-pointer" : ""}>
                {children}
            </div>
            <PaywallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
