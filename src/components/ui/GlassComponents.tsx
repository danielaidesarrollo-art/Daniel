import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Flow Animation Presets
export const flowFadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

export const flowScaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
};

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick, animate = true }) => {
    const Component = animate ? motion.div : 'div';
    const animationProps = animate ? flowScaleIn : {};

    return (
        <Component
            {...animationProps}
            className={cn(
                "glass-card p-6",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
        </Component>
    );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    glow?: boolean;
    children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    variant = 'primary',
    glow = false,
    className,
    ...props
}) => {
    const variants = {
        primary: "bg-[#00E5FF] text-[#0B0E14] hover:bg-[#00B8CC] active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.2)]",
        outline: "border-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#0B0E14]",
        ghost: "text-white hover:bg-white/10"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                glow && "glow-cyan",
                className
            )}
            {...props as any}
        >
            {children}
        </motion.button>
    );
};

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({ label, className, ...props }) => (
    <div className="space-y-2 w-full">
        {label && <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
        <input
            className={cn(
                "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all",
                className
            )}
            {...props}
        />
    </div>
);

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: string[] | { value: string; label: string }[];
}

export const GlassSelect: React.FC<GlassSelectProps> = ({ label, options, className, ...props }) => (
    <div className="space-y-2 w-full">
        {label && <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
        <div className="relative">
            <select
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all appearance-none cursor-pointer",
                    className
                )}
                {...props}
            >
                <option value="" disabled className="bg-[#0B0E14] text-gray-400">Seleccionar...</option>
                {options.map((opt) => {
                    const value = typeof opt === 'string' ? opt : opt.value;
                    const labelText = typeof opt === 'string' ? opt : opt.label;
                    return (
                        <option key={value} value={value} className="bg-[#0B0E14] text-white">
                            {labelText}
                        </option>
                    );
                })}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);
