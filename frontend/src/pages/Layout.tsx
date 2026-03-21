import React, { useState } from "react";
import {
  Users,
  Calendar,
  LogOut,
  LayoutDashboard,
  FileText,
  Bell,
  Edit,
} from "lucide-react";

interface LayoutProps {
  role: "admin" | "member" | null;
  currentPage: string;
  navigate: (page: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  role: "admin" | "member" | null;
  currentPage: string;
  navigate: (page: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  showLabel: boolean;
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  showLabel,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-lg"
          : "hover:bg-slate-800 text-slate-400 hover:text-white"
      }`}
    >
      {icon}
      {showLabel && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

function Sidebar({ isOpen, role, currentPage, navigate }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 p-2 rounded-lg shrink-0">
          <Users size={20} />
        </div>
        {isOpen && <span className="font-bold">CT-LIPN</span>}
      </div>

      <nav className="p-3 space-y-2 mt-4">
        {role === "admin" ? (
          <>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Tableau de Bord"
              active={currentPage === "admin-dash"}
              onClick={() => navigate("admin-dash")}
              showLabel={isOpen}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Membres"
              active={currentPage === "admin-members"}
              onClick={() => navigate("admin-members")}
              showLabel={isOpen}
            />
            <NavItem
              icon={<Calendar size={20} />}
              label="Activités"
              active={currentPage === "admin-activities"}
              onClick={() => navigate("admin-activities")}
              showLabel={isOpen}
            />
          </>
        ) : (
          <>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Mes Missions"
              active={currentPage === "member-dash"}
              onClick={() => navigate("member-dash")}
              showLabel={isOpen}
            />
            <NavItem
              icon={<FileText size={20} />}
              label="Documents"
              active={false}
              onClick={() => {}}
              showLabel={isOpen}
            />
          </>
        )}
      </nav>
    </aside>
  );
}

export default function Layout({
  role,
  currentPage,
  navigate,
  onLogout,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        role={role}
        currentPage={currentPage}
        navigate={navigate}
      />

      <main
        className={`transition-all duration-300 pt-24 pb-12 px-8 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header
          className={`fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-all flex items-center justify-between px-10 ${
            sidebarOpen ? "left-64" : "left-20"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Edit size={20} />
            </button>

            <h2 className="text-lg font-black text-slate-800">
              {currentPage === "admin-dash" && "Vue d'ensemble"}
              {currentPage === "admin-members" && "Gestion du Personnel"}
              {currentPage === "admin-activities" && "Suivi des Activités"}
              {currentPage === "member-dash" && "Mon Espace"}
              {currentPage === "activity-detail" && "Détail de l'activité"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
              JD
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <button
        onClick={onLogout}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-red-400 hover:text-red-600 border border-slate-100 transition-all hover:rotate-12"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}