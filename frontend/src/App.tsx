import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminActivities from "./pages/AdminActivities";
import MemberDashboard from "./pages/MemberDashboard";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import type { Membre, Activite } from "./types";

const INITIAL_MEMBERS: Membre[] = [
  { id: "1", nom: "Loubna MANGOUCHI", email: "L.mangouchi@gmail.com", role: "Membre" },
  { id: "2", nom: "Omayma Gnoug", email: "O.gnoug@gmail.com", role: "Administrateur" },
  { id: "3", nom: "Kaouthar BOUROUIS", email: "K.bourouis@gmail.com", role: "Membre" },
];

const MOCK_ACTIVITIES: Activite[] = [
  { id: 1, type: "CSI", description: "CSI de Alice Martin", dateCreation: "2024-04-01", dateEcheance: "2024-06-15", statut: "En cours", assigne: "Jean Dupont", doctorant: "Alice Martin" },
];

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  
  // État pour gérer la liste des membres dynamiquement
  const [members, setMembers] = useState<Membre[]>(INITIAL_MEMBERS);

  const handleLogin = (selectedRole: "admin" | "member") => {
    setRole(selectedRole);
    setPage(selectedRole === "admin" ? "admin-dash" : "member-dash");
  };

  const handleLogout = () => {
    setRole(null);
    setPage("login");
  };

  // Logique pour ajouter un membre
  const handleAddMember = (newMemberData: Omit<Membre, "id">) => {
    const newMember: Membre = {
      ...newMemberData,
      id: Math.random().toString(36).substr(2, 9), 
    };
    setMembers([...members, newMember]);
  };
  // Logique pour supprimer un membre
  const handleDeleteMember = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };
  // Logique pour modifier un membre
  const handleEditMember = (updatedMember: Membre) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  if (page === "login") return <LoginPage onLogin={handleLogin} />;

  return (
    <Layout role={role} currentPage={page} navigate={setPage} onLogout={handleLogout}>
      {page === "admin-dash" && <AdminDashboard members={members} />}

      {page === "admin-members" && (
        <AdminMembers 
          members={members} 
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember} // <-- Nouvelle prop 
          onEditMember={handleEditMember} // <-- Nouvelle prop
        />
      )}

      {page === "admin-activities" && <AdminActivities activities={MOCK_ACTIVITIES} />}

      {page === "member-dash" && (
        <MemberDashboard
          activities={MOCK_ACTIVITIES}
          onSelect={() => setPage("activity-detail")}
        />
      )}

      {page === "activity-detail" && (
        <ActivityDetailPage onBack={() => setPage("member-dash")} />
      )}
    </Layout>
  );
}