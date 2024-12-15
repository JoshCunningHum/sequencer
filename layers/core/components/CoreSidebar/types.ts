export type SidebarItem = {
    name: string;
    label?: string;
    icon?: string;
    click?: () => void;
    last?: boolean;
    hotkey?: string;
    hotkeyNoDefault?: boolean;
    tooltip?: string;
    route?: string;
};
