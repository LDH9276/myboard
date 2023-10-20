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
                },
            },
            "dark",
        ],
    },
};
