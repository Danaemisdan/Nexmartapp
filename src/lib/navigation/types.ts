export interface NavLink {
    label: string;
    href: string;
}

export interface NavSection {
    title: string;
    links: NavLink[];
}

export interface NavColumn {
    sections: NavSection[];
}

export interface NavTab {
    id: string;
    label: string;
    columns: NavColumn[];
}

export interface NavData {
    id: string;
    label: string;
    tabs?: NavTab[]; // For Fashion (Men, Women, Kids)
    columns?: NavColumn[]; // For Home, Beauty, etc.
}
