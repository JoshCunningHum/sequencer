import type { theme } from "#tailwind-config";

export default {
    theme: {
        extend: {
            animation: {
                "fade-in": "fadeIn 1.25s ease-in-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            fontFamily: {
                custom: ["DMSans"],
            },
        },
    },
    plugins: [require("tailwindcss-primeui")],
    content: ["app/**/*.{vue,js,ts,css,scss}"],
};
