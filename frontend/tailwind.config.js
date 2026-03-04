/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                study: {
                    50: '#f5f7ff',
                    100: '#ebf0fe',
                    200: '#ced9fd',
                    300: '#a3b8fc',
                    400: '#728efa',
                    500: '#4a6cf7',
                    600: '#334ef2',
                    700: '#2539e1',
                    800: '#1d2db8',
                    900: '#1a2793',
                },
            },
        },
    },
    plugins: [],
}
