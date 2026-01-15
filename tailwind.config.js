/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'stitch-blue': '#0A0F1E',
                'slate-gray': '#1E293B',
                'emerald-glow': '#10B981',
                // Google Flow Colors
                'flow-cyan': '#00D9FF',
                'flow-magenta': '#E91E63',
                'flow-purple': '#9C27B0',
                'flow-emerald': '#10B981',
                'flow-dark': '#000000',
            },
            animation: {
                'pulse-emerald': 'pulse-emerald 2s infinite',
                'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'particle-float': 'particle-float 3s ease-in-out infinite',
                'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
            },
            keyframes: {
                'neural-pulse': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                'glow-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(233, 30, 99, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(233, 30, 99, 0.5)'
                    },
                },
                'particle-float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
}
