/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'ken-burns': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.15)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'ken-burns': 'ken-burns 25s ease-in-out infinite alternate',
                'fade-in-up': 'fade-in-up 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            },
        },
    },
    plugins: [],
    keyframes: {
        'gallery-sequence': {
            '0%, 16%': { opacity: '0.6' }, // Active image visibility
            '20%, 100%': { opacity: '0' },  // Transition to next
        },
    },
    animation: {
        'gallery-sequence': 'gallery-sequence 24s infinite',
    },
}
