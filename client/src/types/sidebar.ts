export interface SidebarItem {
  label: string;
  key: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeKey: string;
  onItemClick: (key: string) => void;
}
