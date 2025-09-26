"use client";

import {
  Home,
  TrendingUp,
  Plus,
  Users,
  Settings,
  BarChart2,
} from "lucide-react";

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside
      className={`${
        mobile
          ? "h-full overflow-y-auto"
          : "hidden lg:block w-64 h-[calc(100vh-4rem)] border-r p-8 text-sm fixed top-16 left-0 overflow-y-auto"
      }`}
    >
      <div className="space-y-4 ">
        <SidebarSection title="NAVIGATION">
          <SidebarItem icon={<Home size={20} />} label="Home" />
          <SidebarItem icon={<TrendingUp size={20} />} label="Popular" />

          <SidebarItem icon={<Users size={20} />} label="Explore" />
          <SidebarItem icon={<BarChart2 size={20} />} label="All" />
        </SidebarSection>
      </div>

      <SidebarSection title="QUESTION">
        <SidebarItem icon={<Plus size={20} />} label="Ask an question" />
      </SidebarSection>

      <SidebarSection title="COMMUNITIES">
        <SidebarItem icon={<Plus size={20} />} label="Create Community" />
        <SidebarItem icon={<Settings size={20} />} label="Manage Communities" />
      </SidebarSection>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  beta = false,
}: {
  icon: React.ReactNode;
  label: string;
  beta?: boolean;
}) {
  return (
    <div className="flex items-center space-x-3 cursor-pointer hover:underline py-1">
      <div className="text-primary">{icon}</div>
      <span>{label}</span>
      {beta && <span className="text-xs text-red-600 font-semibold">BETA</span>}
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 mb-6 ">
      <h3 className="text-xs text-gray-500 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
