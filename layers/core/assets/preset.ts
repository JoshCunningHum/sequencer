import { definePreset } from "@primevue/themes";
import PrimeVueStyle from "@primevue/themes/aura";

export default definePreset(PrimeVueStyle, {
    semantic: {
        surface: {
            50: "{neutral.50}",
            100: "{neutral.100}",
            200: "{neutral.200}",
            300: "{neutral.300}",
            400: "{neutral.400}",
            500: "{neutral.500}",
            600: "{neutral.600}",
            700: "{neutral.700}",
            800: "{neutral.800}",
            900: "{neutral.900}",
            950: "{neutral.950}",
        },
        colorScheme: {
            light: {
                surface: {
                    50: "{neutral.50}",
                    100: "{neutral.100}",
                    200: "{neutral.200}",
                    300: "{neutral.300}",
                    400: "{neutral.400}",
                    500: "{neutral.500}",
                    600: "{neutral.600}",
                    700: "{neutral.700}",
                    800: "{neutral.800}",
                    900: "{neutral.900}",
                    950: "{neutral.950}",
                },
            },
            dark: {
                surface: {
                    50: "{neutral.50}",
                    100: "{neutral.100}",
                    200: "{neutral.200}",
                    300: "{neutral.300}",
                    400: "{neutral.400}",
                    500: "{neutral.500}",
                    600: "{neutral.600}",
                    700: "{neutral.700}",
                    800: "{neutral.800}",
                    900: "{neutral.900}",
                    950: "{neutral.950}",
                },
            },
        },
        borderRadius: {
            xs: "1px",
            sm: "2px",
            md: "3px",
            lg: "4px",
            xl: "5px",
        },
    },
    components: {
        button: {
            root: {
                class: "px-3 py-1",
            },
        },
    },
});
