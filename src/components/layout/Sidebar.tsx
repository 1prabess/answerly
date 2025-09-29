"use client";

import { useState } from "react";
import { Home, TrendingUp, Plus, Users, BarChart2 } from "lucide-react";
import QuestionFormModal from "@/app/feed/_components/QuestionFormModal";

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside
        className={`${
          mobile
            ? "h-full overflow-y-auto "
            : "w-54 h-[calc(100vh-64px)] border-r py-2 text-sm sticky top-20"
        }`}
      >
        <div className="space-y-4">
          <SidebarSection title="NAVIGATION">
            <SidebarItem icon={<Home size={20} />} label="Home" />
            <SidebarItem icon={<TrendingUp size={20} />} label="Popular" />
            <SidebarItem icon={<Users size={20} />} label="Explore" />
            <SidebarItem icon={<BarChart2 size={20} />} label="All" />
          </SidebarSection>

          <SidebarSection title="QUESTION">
            <SidebarItem
              icon={<Plus size={20} />}
              label="Ask a question"
              onClick={() => setIsModalOpen(true)}
            />
          </SidebarSection>

          <SidebarSection title="COMMUNITIES">
            <SidebarItem icon={<Plus size={20} />} label="Create Community" />
          </SidebarSection>
        </div>
      </aside>

      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

function SidebarItem({
  icon,
  label,
  beta = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  beta?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:underline py-1"
      onClick={onClick}
    >
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
    <div className="space-y-2 mb-6">
      <h3 className="text-xs text-gray-500 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
