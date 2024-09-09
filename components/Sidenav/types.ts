import type { RouteLocationAsString } from "vue-router";

export type SidebarItem = {
    name: string;
    label?: string;
    icon?: string;
    click?: () => void;
    last?: boolean;
    hotkey?: string;
    tooltip?: string;
    route?: RouteLocationAsString; // ? Change to string when no vue-router installed
};
