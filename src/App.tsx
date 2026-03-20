import React, { useState } from 'react';
import { 
  Users, Calendar, CheckCircle, Clock, Plus, LogOut, LayoutDashboard, 
  FileText, Bell, Search, Filter, Upload, UserPlus, ArrowRight, 
  ChevronRight, Edit, Trash2, BarChart3 
} from 'lucide-react';

// --- Importation des types (Simulée ici) ---
// Dans votre projet : import { Membre, Activite } from './types';

export interface Membre {
  id: number;
  nom: string;
  email: string;
  role: 'Administrateur' | 'Membre';
  labo?: string;
  charge: number;
}

export interface Activite {
  id: number;
  type: 'CSI' | 'Rapport' | 'Audition';
  description: string;
  dateCreation: string;
  dateEcheance: string;
  statut: 'À faire' | 'En cours' | 'Terminé';
  assigne: string;
  doctorant?: string;
}

// --- Données de test ---
const MOCK_MEMBERS: Membre[] = [
  { id: 1, nom: "Jean Dupont", email: "j.dupont@lipn.fr", role: "Membre", labo: "AOD", charge: 65 },
  { id: 2, nom: "Marie Curie", email: "m.curie@lipn.fr", role: "Administrateur", labo: "CALIN", charge: 30 },
  { id: 3, nom: "Pierre Rossi", email: "p.rossi@lipn.fr", role: "Membre", labo: "LRC", charge: 85 },
];

const MOCK_ACTIVITIES: Activite[] = [
  { id: 1, type: "CSI", description: "CSI de Alice Martin (1ère année)", dateCreation: "2024-04-01", dateEcheance: "2024-06-15", statut: "En cours", assigne: "Jean Dupont", doctorant: "Alice Martin" },
  { id: 2, type: "Rapport", description: "Rapport scientifique annuel 2024", dateCreation: "2024-04-10", dateEcheance: "2024-07-01", statut: "À faire", assigne: "Non affecté", doctorant: "N/A" },
  { id: 3, type: "Audition", description: "Audition mi-parcours Kevin Durand", dateCreation: "2024-03-20", dateEcheance: "2024-05-20", statut: "Terminé", assigne: "Pierre Rossi", doctorant: "Kevin Durand" },
];

// --- Composants de mise en page ---

const Sidebar = ({ isOpen, role, currentPage, navigate }: any) => (
  <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
    <div className="p-6 flex items-center gap-3 border-b border-slate-800">
      <div className="bg-indigo-500 p-2 rounded-lg shrink-0"><Users size={20} /></div>
      {isOpen && <span className="font-bold">CT-LIPN</span>}
    </div>
    <nav className="p-3 space-y-2 mt-4">
      {role === 'admin' ? (
        <>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Tableau de Bord" active={currentPage === 'admin-dash'} onClick={() => navigate('admin-dash')} showLabel={isOpen} />
          <NavItem icon={<Users size={20}/>} label="Membres" active={currentPage === 'admin-members'} onClick={() => navigate('admin-members')} showLabel={isOpen} />
          <NavItem icon={<Calendar size={20}/>} label="Activités" active={currentPage === 'admin-activities'} onClick={() => navigate('admin-activities')} showLabel={isOpen} />
        </>
      ) : (
        <>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Mes Missions" active={currentPage === 'member-dash'} onClick={() => navigate('member-dash')} showLabel={isOpen} />
          <NavItem icon={<FileText size={20}/>} label="Documents" active={false} onClick={() => {}} showLabel={isOpen} />
        </>
      )}
    </nav>
  </aside>
);

const NavItem = ({ icon, label, active, onClick, showLabel }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
    {icon} {showLabel && <span className="text-sm font-medium">{label}</span>}
  </button>
);

// --- PAGES ---

const LoginPage = ({ onLogin }: any) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 border border-slate-100">
      <div className="text-center mb-10">
        <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <Users className="text-indigo-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Comité des Thèses</h1>
        <p className="text-slate-500 mt-2 font-medium">Laboratoire LIPN</p>
      </div>
      <div className="space-y-4">
        <button onClick={() => onLogin('admin')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group">
          Accès Administrateur <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button onClick={() => onLogin('member')} className="w-full bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 font-bold py-4 rounded-2xl transition-all">
          Accès Membre du Comité
        </button>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="bg-blue-500 p-4 rounded-2xl text-white"><Users size={24}/></div>
        <div><p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Membres</p><h3 className="text-2xl font-black">15</h3></div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="bg-amber-500 p-4 rounded-2xl text-white"><Clock size={24}/></div>
        <div><p className="text-slate-500 text-sm font-bold uppercase tracking-wider">En cours</p><h3 className="text-2xl font-black">28</h3></div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="bg-emerald-500 p-4 rounded-2xl text-white"><CheckCircle size={24}/></div>
        <div><p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Terminées</p><h3 className="text-2xl font-black">142</h3></div>
      </div>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-indigo-600" /> Charge de travail par membre</h3>
      <div className="space-y-6">
        {MOCK_MEMBERS.map(m => (
          <div key={m.id}>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-slate-700">{m.nom}</span>
              <span className="text-slate-400 font-bold">{m.charge}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${m.charge > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${m.charge}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminMembers = () => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-xl font-bold">Liste des membres</h3>
      <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <UserPlus size={18}/> Nouveau membre
      </button>
    </div>
    <table className="w-full text-left">
      <thead className="bg-slate-50/50">
        <tr>
          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Nom</th>
          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Rôle</th>
          <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {MOCK_MEMBERS.map(m => (
          <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <div className="font-bold text-slate-800">{m.nom}</div>
              <div className="text-xs text-slate-400">{m.email}</div>
            </td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.role === 'Administrateur' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {m.role}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={18}/></button>
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MemberDashboard = ({ onSelect }: any) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200">
      <h2 className="text-3xl font-black mb-2">Bonjour, Dr. Jean Dupont</h2>
      <p className="text-indigo-100 font-medium">Vous avez 2 activités en attente cette semaine.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_ACTIVITIES.slice(0, 2).map(act => (
        <div key={act.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group" onClick={onSelect}>
          <div className="flex justify-between items-start mb-6">
            <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{act.type}</span>
            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase">{act.statut}</span>
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{act.description}</h4>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-6">
            <Clock size={16} /> Échéance : {act.dateEcheance}
          </div>
          <button className="mt-8 w-full bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            Mettre à jour
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ActivityDetail = ({ onBack }: any) => (
  <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
    <button onClick={onBack} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
      <ChevronRight className="rotate-180" size={20} /> Retour aux missions
    </button>
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-10 border-b border-slate-50">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">CSI</span>
          <div className="text-right">
            <p className="text-xs font-black text-slate-300 uppercase">Échéance</p>
            <p className="text-lg font-black text-red-500">15 Juin 2024</p>
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-800">CSI de Alice Martin (1ère année)</h2>
      </div>
      <div className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest"><Clock size={18} className="text-indigo-600" /> État de la mission</h4>
            <div className="grid grid-cols-3 gap-3">
              {['À faire', 'En cours', 'Terminé'].map(s => (
                <button key={s} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${s === 'En cours' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest"><Upload size={18} className="text-indigo-600" /> Dépôt de document</h4>
            <div className="border-3 border-dashed border-slate-100 rounded-[32px] p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 cursor-pointer group">
              <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="text-indigo-600" size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700">Cliquer pour uploader</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PDF uniquement</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest">Annuler</button>
          <button className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase text-xs tracking-widest">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL (ROUTER SIMULÉ) ---

export default function App() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (selectedRole: 'admin' | 'member') => {
    setRole(selectedRole);
    setPage(selectedRole === 'admin' ? 'admin-dash' : 'member-dash');
  };

  if (page === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar isOpen={sidebarOpen} role={role} currentPage={page} navigate={setPage} />
      
      <main className={`transition-all duration-300 pt-24 pb-12 px-8 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className={`fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-all flex items-center justify-between px-10 ${sidebarOpen ? 'left-64' : 'left-20'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={20}/></button>
            <h2 className="text-lg font-black text-slate-800">
              {page === 'admin-dash' && "Vue d'ensemble"}
              {page === 'admin-members' && "Gestion du Personnel"}
              {page === 'admin-activities' && "Suivi des Activités"}
              {page === 'member-dash' && "Mon Espace"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 relative transition-colors">
              <Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">JD</div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {page === 'admin-dash' && <AdminDashboard />}
          {page === 'admin-members' && <AdminMembers />}
          {page === 'admin-activities' && <AdminMembers />} {/* Réutilisé pour l'exemple */}
          {page === 'member-dash' && <MemberDashboard onSelect={() => setPage('activity-detail')} />}
          {page === 'activity-detail' && <ActivityDetail onBack={() => setPage('member-dash')} />}
        </div>
      </main>

      <button onClick={() => setPage('login')} className="fixed bottom-6 right-6 w-14 h-14 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-red-400 hover:text-red-600 border border-slate-100 transition-all hover:rotate-12">
        <LogOut size={24}/>
      </button>
    </div>
  );
}