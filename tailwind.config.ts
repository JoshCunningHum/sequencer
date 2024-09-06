import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default <Partial<Config>>{
    theme: {
        extend: {
            fontFamily: {
                custom: ["DMSans"],
            },
        },
    },
    plugins: [require("tailwindcss-primeui")],
    content: [
        "components/**/*.{vue,js,ts}",
        "layouts/**/*.vue",
        "pages/**/*.vue",
        "composables/**/*.{js,ts}",
        "plugins/**/*.{js,ts}",
        "App.{js,ts,vue}",
        "app.{js,ts,vue}",
        "Error.{js,ts,vue}",
        "error.{js,ts,vue}",
        "content/**/*.md",
    ],
};
