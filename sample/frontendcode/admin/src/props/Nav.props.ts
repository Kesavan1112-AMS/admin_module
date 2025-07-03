export interface NavChild {
    label: string;
    to: string;
    privilege?: number[]
}

export interface NavItem {
    label: string;
    to?: string;
    privilege?: number[];
    children?: NavChild[];
}

