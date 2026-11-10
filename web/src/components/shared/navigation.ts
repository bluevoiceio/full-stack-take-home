import { Bell, Home, type LucideIcon, User, Users } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// The sidebar renders from this list, so a new page is added here.
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Users', href: '/dashboard/users', icon: User },
  { label: 'Groups', href: '/dashboard/groups', icon: Users },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];
