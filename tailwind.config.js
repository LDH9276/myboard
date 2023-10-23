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
                    primary: "#A7C636",
                    secondary: "#8DA82B",
                    accent: "#CFFA32",
                    neutral: "#3d4451",
                    "base-100": "#ffffff",
                    "base-200": "#ffffff",
                    "base-content": "#333",
                },
            },
            {
                dark: {
                    primary: "#65781F",
                    secondary: "#65781F",
                    accent: "#CFFA32",
                    neutral: "#3d4451",
                    "base-100": "#000",
                    "base-200": "#333",
                    "base-content": "#e8e8e8",
                    "primary-content": "#A7C636"
                }
            }
        ],
    },
};
