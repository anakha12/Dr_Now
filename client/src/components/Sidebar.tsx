import React from "react";
import type { SidebarProps } from "../types/sidebar";

const Sidebar: React.FC<SidebarProps> = ({ items, activeKey, onItemClick }) => {
  return (
    <aside className="w-64 bg-white/90 border-r border-teal-200 shadow-lg flex flex-col py-8 px-4">
      <nav className="flex-1">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onItemClick(item.key)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${
                  activeKey === item.key
                    ? "bg-teal-600 text-white shadow"
                    : "text-teal-700 hover:bg-teal-100"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
