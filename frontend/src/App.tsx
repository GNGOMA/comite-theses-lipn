import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminActivities from "./pages/AdminActivities";
import MemberDashboard from "./pages/MemberDashboard";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import type { Membre } from "./types";

const INITIAL_MEMBERS: Membre[] = [
  { id: 1, nom: "Loubna MANGOUCHI", email: "L.mangouchi@gmail.com", role: "Membre", charge: 0 },
  { id: 2, nom: "Omayma Gnoug", email: "O.gnoug@gmail.com", role: "Administrateur", charge: 0 },
  { id: 3, nom: "Kaouthar BOUROUIS", email: "K.bourouis@gmail.com", role: "Membre", charge: 0 },
];

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  const [members, setMembers] = useState<Membre[]>(INITIAL_MEMBERS);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  const handleLogin = (selectedRole: "admin" | "member") => {
    setRole(selectedRole);
    setPage(selectedRole === "admin" ? "admin-dash" : "member-dash");
  };

  const handleLogout = () => {
    setRole(null);
    setPage("login");
  };

  const handleAddMember = (newMemberData: Omit<Membre, "id">) => {
    const newMember: Membre = {
      ...newMemberData,
      id: members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1,
    };

    setMembers([...members, newMember]);
  };

  const handleDeleteMember = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleEditMember = (updatedMember: Membre) => {
    setMembers(members.map((m) =>
      m.id === updatedMember.id ? updatedMember : m
    ));
  };

  const handleEditMember = async (updatedMember: Membre) => {
    try {
      const response = await fetch(`${API_URL}/membres/${updatedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: updatedMember.nom,
          email: updatedMember.email,
          role: updatedMember.role
        }),
      });
      if (response.ok) fetchMembers();
    } catch (error) {
      console.error("Erreur modification membre:", error);
    }
  };

  // --- RENDU DE L'INTERFACE ---

  if (page === "login") return <LoginPage onLogin={handleLogin} />;

  return (
    <Layout role={role} currentPage={page} navigate={setPage} onLogout={handleLogout}>
      
      {page === "admin-dash" && <AdminDashboard members={members} />}

      {/* Gestion des Membres */}
      {page === "admin-members" && (
        <AdminMembers
          members={members}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
          onEditMember={handleEditMember}
        />
      )}

      {page === "admin-activities" && <AdminActivities activities={[]} />}

      {/* Dashboard Membre */}
      {page === "member-dash" && (
        <MemberDashboard
          onSelect={(activity) => {
            setSelectedActivity(activity);
            setPage("activity-detail");
          }}
        />
      )}

      {/* Détails d'une activité */}
      {page === "activity-detail" && (
        <ActivityDetailPage
          activity={selectedActivity}
          onBack={() => setPage("member-dash")}
        />
      )}
    </Layout>
  );
}