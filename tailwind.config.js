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
            },
            animation: {
                'pulse-emerald': 'pulse-emerald 2s infinite',
            },
        },
    },
    plugins: [],
}
