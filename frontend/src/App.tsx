import React, { useState } from "react";
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
  const [user, setUser] = useState<any>(null); // Stocke les données de l'utilisateur depuis MySQL
  const [members, setMembers] = useState<Membre[]>(INITIAL_MEMBERS);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Gère la connexion réussie depuis la LoginPage
  const handleLogin = (selectedRole: "admin" | "member", userData: any) => {
    setRole(selectedRole);
    setUser(userData);
    setPage(selectedRole === "admin" ? "admin-dash" : "member-dash");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setUser(null);
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

  if (page === "login") return <LoginPage onLogin={handleLogin} />;

  return (
    <Layout role={role} currentPage={page} navigate={setPage} onLogout={handleLogout} userName={user?.nom}>
      
      {page === "admin-dash" && <AdminDashboard members={members} />}

      {page === "admin-members" && (
        <AdminMembers
          members={members}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
          onEditMember={handleEditMember}
        />
      )}

      {page === "admin-activities" && <AdminActivities activities={[]} />}

      {page === "member-dash" && (
        <MemberDashboard
          onSelect={(activity: any) => {
            setSelectedActivity(activity);
            setPage("activity-detail");
          }}
        />
      )}

      {page === "activity-detail" && (
        <ActivityDetailPage
          activity={selectedActivity}
          onBack={() => setPage("member-dash")}
        />
      )}

    </Layout>
  );
}