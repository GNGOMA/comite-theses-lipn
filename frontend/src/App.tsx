import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminActivities from "./pages/AdminActivities";
import MemberDashboard from "./pages/MemberDashboard";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import type { Membre, Activite } from "./types";

// --- Données mock ---
const MOCK_MEMBERS: Membre[] = [
  {
    id: 1,
    nom: "Jean Dupont",
    email: "j.dupont@lipn.fr",
    role: "Membre",
    labo: "AOD",
    charge: 65,
  },
  {
    id: 2,
    nom: "Marie Curie",
    email: "m.curie@lipn.fr",
    role: "Administrateur",
    labo: "CALIN",
    charge: 30,
  },
  {
    id: 3,
    nom: "Pierre Rossi",
    email: "p.rossi@lipn.fr",
    role: "Membre",
    labo: "LRC",
    charge: 85,
  },
];

const MOCK_ACTIVITIES: Activite[] = [
  {
    id: 1,
    type: "CSI",
    description: "CSI de Alice Martin (1ère année)",
    dateCreation: "2024-04-01",
    dateEcheance: "2024-06-15",
    statut: "En cours",
    assigne: "Jean Dupont",
    doctorant: "Alice Martin",
  },
  {
    id: 2,
    type: "Rapport",
    description: "Rapport scientifique annuel 2024",
    dateCreation: "2024-04-10",
    dateEcheance: "2024-07-01",
    statut: "À faire",
    assigne: "Non affecté",
    doctorant: "N/A",
  },
  {
    id: 3,
    type: "Audition",
    description: "Audition mi-parcours Kevin Durand",
    dateCreation: "2024-03-20",
    dateEcheance: "2024-05-20",
    statut: "Terminé",
    assigne: "Pierre Rossi",
    doctorant: "Kevin Durand",
  },
];

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState<"admin" | "member" | null>(null);

  const handleLogin = (selectedRole: "admin" | "member") => {
    setRole(selectedRole);
    setPage(selectedRole === "admin" ? "admin-dash" : "member-dash");
  };

  const handleLogout = () => {
    setRole(null);
    setPage("login");
  };

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout
      role={role}
      currentPage={page}
      navigate={setPage}
      onLogout={handleLogout}
    >
      {page === "admin-dash" && <AdminDashboard members={MOCK_MEMBERS} />}

      {page === "admin-members" && <AdminMembers members={MOCK_MEMBERS} />}

      {page === "admin-activities" && (
        <AdminActivities activities={MOCK_ACTIVITIES} />
      )}

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