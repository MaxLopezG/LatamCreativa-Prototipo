// Navigation Types
import { LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    icon: LucideIcon;
    label?: string;
    active?: boolean;
    badge?: string;
}

export interface NavSection {
    title: string;
    items: CategoryItem[];
}

export interface CategoryItem {
    icon: LucideIcon;
    label: string;
    subLabel?: string;
    active?: boolean;
    hasUpdate?: boolean;
    subItems?: string[];
}

export interface Subscription {
    id: string;
    name: string;
    image: string;
    isLive?: boolean;
}

export interface Chip {
    id: string;
    label: string;
    image?: string;
    active?: boolean;
}
