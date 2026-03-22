import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminActivities from "./pages/AdminActivities";
import MemberDashboard from "./pages/MemberDashboard";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import type { Membre, Activite } from "./types";

// L'URL de ton backend FastAPI
const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  
  // États pour les données venant de la BDD
  const [members, setMembers] = useState<Membre[]>([]);
  const [activities, setActivities] = useState<Activite[]>([]);

  // --- 1. CHARGEMENT DES DONNÉES ---
  
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/membres`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Erreur chargement membres:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/activites`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Erreur chargement activités:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchActivities();
  }, []);

  // --- 2. LOGIQUE AUTHENTIFICATION ---

  const handleLogin = (selectedRole: "admin" | "member") => {
    setRole(selectedRole);
    setPage(selectedRole === "admin" ? "admin-dash" : "member-dash");
  };

  const handleLogout = () => {
    setRole(null);
    setPage("login");
  };

  // --- 3. ACTIONS MEMBRES (CRUD) ---

  const handleAddMember = async (newMemberData: Omit<Membre, "id">) => {
    try {
      const response = await fetch(`${API_URL}/membres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberData),
      });
      if (response.ok) fetchMembers();
    } catch (error) {
      console.error("Erreur ajout membre:", error);
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        const response = await fetch(`${API_URL}/membres/${id}`, {
          method: "DELETE",
        });
        if (response.ok) fetchMembers();
      } catch (error) {
        console.error("Erreur suppression membre:", error);
      }
    }
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
      
      {/* Dashboard Admin : Stats basées sur les données réelles */}
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

      {/* Liste des activités (Admin) */}
      {page === "admin-activities" && <AdminActivities activities={activities} />}

      {/* Dashboard Membre */}
      {page === "member-dash" && (
        <MemberDashboard
          activities={activities}
          onSelect={() => setPage("activity-detail")}
        />
      )}

      {/* Détails d'une activité */}
      {page === "activity-detail" && (
        <ActivityDetailPage onBack={() => setPage("member-dash")} />
      )}
      
    </Layout>
  );
}