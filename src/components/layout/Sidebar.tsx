"use client";

import { useState } from "react";
import { Home, TrendingUp, Plus, Users, BarChart2 } from "lucide-react";
// import QuestionFormModal from "@/app/feed/_components/QuestionFormModal";
import CreateCommunityModal from "@/features/communities/components/CreateCommunityModal"; // 👈 import your modal
import QuestionFormModal from "@/features/questions/components/QuestionFormModal";

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  return (
    <>
      <aside
        className={` ${
          mobile
            ? "h-full overflow-y-auto"
            : "sticky top-20 h-[calc(100vh-64px)] w-48 border-r py-2 text-sm"
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
              onClick={() => setIsQuestionModalOpen(true)}
            />
          </SidebarSection>

          <SidebarSection title="COMMUNITIES">
            <SidebarItem
              icon={<Plus size={20} />}
              label="Create Community"
              onClick={() => setIsCommunityModalOpen(true)}
            />
          </SidebarSection>
        </div>
      </aside>

      {/* Question Modal */}
      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />

      {/* Community Modal */}
      <CreateCommunityModal
        open={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
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
      className="flex cursor-pointer items-center gap-2 py-1 hover:underline"
      onClick={onClick}
    >
      <div className="text-primary">{icon}</div>
      <span>{label}</span>
      {beta && <span className="text-xs font-semibold text-red-600">BETA</span>}
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
    <div className="mb-6 space-y-2">
      <h3 className="text-xs font-semibold text-gray-500">{title}</h3>
      {children}
    </div>
  );
}
