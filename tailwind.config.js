/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#386a20",
                    secondary: "#042100",
                    accent: "#CFFA32",
                    neutral: "#ddd",
                    "base-100": "#fff",
                    "base-200": "#d9e7cb",
                    "base-content": "#333",
                },
            },
            {
                dark: {
                    primary: "#55624c",
                    secondary: "#386a20",
                    accent: "#CFFA32",
                    neutral: "#666",
                    "base-100": "#000",
                    "base-200": "#333",
                    "base-content": "#e8e8e8",
                    "primary-content": "#A7C636"
                }
            }
        ],
    },
};
