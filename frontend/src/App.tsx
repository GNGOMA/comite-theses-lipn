import React, { useState } from 'react';
import { 
  Users, Calendar, CheckCircle, Clock, Plus, LogOut, LayoutDashboard, 
  FileText, Bell, Search, Filter, Upload, UserPlus, ArrowRight, 
  ChevronRight, Edit, Trash2, BarChart3, MoreVertical, Shield, Briefcase,
  ShieldCheck, Lock, ChevronLeft, UserCircle
} from 'lucide-react';

// ==========================================
// 1. INTERFACES (Types TypeScript)
// ==========================================

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

export interface Mandat {
  id: number;
  membreId: number;
  membreNom: string;
  dateDebut: string;
  dateFin: string;
  statut: 'Actif' | 'Terminé';
}

// ==========================================
// 2. COMPOSANTS DE PAGES
// ==========================================

// --- PAGE DE CONNEXION ET INSCRIPTION ---
type ViewState = 'selection' | 'login' | 'register';

const LoginPage = ({ onLogin }: { onLogin: (role: 'admin' | 'member', userData: any) => void }) => {
  const [view, setView] = useState<ViewState>('selection');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | null>(null);
  
  // Champs de formulaire
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // États de l'interface
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (role: 'admin' | 'member') => {
    setSelectedRole(role);
    setView('login');
    setError(''); 
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          role: selectedRole === 'admin' ? 'Administrateur' : 'Membre'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        onLogin(selectedRole!, data.user);
      } else {
        setError(data.detail || "Identifiants incorrects.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur backend (MySQL).");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom,
          email: email,
          password: password,
          role: selectedRole === 'admin' ? 'Administrateur' : 'Membre'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setView('login');
        setPassword(''); // On vide le mot de passe par sécurité
      } else {
        setError(data.detail || "Erreur lors de la création du compte.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
        
        {/* VUE 1 : SÉLECTION DU RÔLE */}
        {view === 'selection' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="bg-indigo-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 transform -rotate-6 shadow-inner border border-indigo-100">
                <Users className="text-indigo-600" size={48} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Comité des Thèses</h1>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Laboratoire LIPN</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleRoleSelection('admin')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 group text-lg"
              >
                Accès Administrateur 
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => handleRoleSelection('member')} 
                className="w-full bg-white border-2 border-slate-100 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 font-bold py-5 rounded-3xl transition-all text-lg"
              >
                Accès Membre du Comité
              </button>
            </div>
          </div>
        )}

        {/* VUE 2 : FORMULAIRE DE CONNEXION */}
        {view === 'login' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setView('selection'); setError(''); setSuccessMsg(''); }}
              className="mb-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              <ChevronLeft size={16} /> Changer de profil
            </button>

            <div className="text-center mb-8">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <UserCircle className="text-slate-400" size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Connexion {selectedRole === 'admin' ? 'Admin' : 'Membre'}
              </h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                  <CheckCircle size={16} /> {successMsg}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="votre.nom@lipn.fr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-12"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? "Vérification..." : "Valider l'accès"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* LE BOUTON D'INSCRIPTION EST ICI ! */}
            <div className="mt-8 text-center border-t border-slate-50 pt-6">
              <p className="text-xs text-slate-500 font-medium">Pas encore de compte ?</p>
              <button 
                type="button" 
                onClick={() => { setView('register'); setError(''); setSuccessMsg(''); setPassword(''); }} 
                className="text-indigo-600 text-sm font-black mt-2 hover:underline flex items-center justify-center gap-2 w-full"
              >
                <UserPlus size={16}/> Créer un compte {selectedRole === 'admin' ? 'Administrateur' : 'Membre'}
              </button>
            </div>
          </div>
        )}

        {/* VUE 3 : FORMULAIRE D'INSCRIPTION */}
        {view === 'register' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setView('login'); setError(''); }}
              className="mb-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              <ChevronLeft size={16} /> Retour à la connexion
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Nouveau {selectedRole === 'admin' ? 'Administrateur' : 'Membre'}
              </h2>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="votre.nom@lipn.fr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-12"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? "Création en cours..." : "S'inscrire"}
                {!loading && <UserPlus size={20} />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --- AUTRES COMPOSANTS (DASHBOARDS) ---
const AdminDashboard = ({ members }: { members: Membre[] }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
        <div className="bg-blue-500 p-5 rounded-3xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform"><Users size={28}/></div>
        <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Membres</p><h3 className="text-3xl font-black text-slate-800">{members.length}</h3></div>
      </div>
      <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
        <div className="bg-amber-500 p-5 rounded-3xl text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform"><Clock size={28}/></div>
        <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">En cours</p><h3 className="text-3xl font-black text-slate-800">0</h3></div>
      </div>
      <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
        <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform"><CheckCircle size={28}/></div>
        <div><p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Terminées</p><h3 className="text-3xl font-black text-slate-800">0</h3></div>
      </div>
    </div>
    
    {members.length === 0 ? (
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
        <p className="text-slate-400 italic">Aucune donnée trouvée. Vous devrez récupérer les données depuis MySQL via de futurs endpoints API.</p>
      </div>
    ) : (
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><BarChart3 className="text-indigo-600" size={24} /></div>
          Répartition de la charge (%)
        </h3>
        <div className="space-y-8">
          {members.map(m => (
            <div key={m.id}>
              <div className="flex justify-between mb-3 items-end">
                <div><span className="font-black text-slate-800 block text-lg">{m.nom}</span><span className="text-slate-400 text-xs font-bold uppercase">{m.labo}</span></div>
                <span className={`font-black text-lg ${m.charge > 80 ? 'text-red-500' : 'text-indigo-600'}`}>{m.charge}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full rounded-full shadow-sm transition-all duration-1000 ${m.charge > 80 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-indigo-400 to-indigo-600'}`} style={{ width: `${m.charge}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const AdminMandats = ({ mandats }: { mandats: Mandat[] }) => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
    <div className="p-10 border-b border-slate-50 flex justify-between items-center">
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">Historique des mandats</h3>
        <p className="text-slate-400 font-medium">Suivi temporel des membres du comité</p>
      </div>
      <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
        <Plus size={18}/> Nouveau Mandat
      </button>
    </div>
    <div className="p-4">
      {mandats.length === 0 ? (
         <div className="p-10 text-center text-slate-400 italic">Aucun mandat en base de données pour le moment.</div>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Membre</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Période</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mandats.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-8 font-black text-slate-800">{m.membreNom}</td>
                <td className="px-8 py-8 text-slate-600 font-medium italic">Du {m.dateDebut} au {m.dateFin}</td>
                <td className="px-8 py-8">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${m.statut === 'Actif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {m.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

const CreateActivityForm = ({ onCancel, onCreate }: { onCancel: () => void, onCreate: (a: Activite) => void }) => {
  const [formData, setFormData] = useState<Partial<Activite>>({ type: 'CSI', statut: 'À faire', assigne: 'Non affecté' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ ...formData, id: Date.now(), dateCreation: new Date().toISOString().split('T')[0] } as Activite);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-12 max-w-2xl mx-auto animate-in zoom-in-95">
      <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Nouvelle Activité</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type d'activité</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option value="CSI">CSI de thèse</option>
              <option value="Audition">Audition annuelle</option>
              <option value="Rapport">Rapport scientifique</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Échéance</label>
            <input 
              type="date" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
              onChange={e => setFormData({...formData, dateEcheance: e.target.value})}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description / Sujet</label>
          <input 
            type="text" 
            placeholder="Ex: CSI de Alice Martin (1ère année)" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Doctorant concerné (Optionnel)</label>
          <input 
            type="text" 
            placeholder="Nom de l'étudiant" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
            onChange={e => setFormData({...formData, doctorant: e.target.value})}
          />
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={onCancel} className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-3xl uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
          <button type="submit" className="px-8 py-4 bg-indigo-600 text-white font-black rounded-3xl uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Créer l'activité</button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 3. COMPOSANT PRINCIPAL (GESTIONNAIRE)
// ==========================================

export default function App() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [user, setUser] = useState<any>(null); // Stocke les vraies infos de l'utilisateur connecté
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // États vidés de leurs mock datas (à remplir plus tard avec un useEffect et un fetch backend)
  const [members, setMembers] = useState<Membre[]>([]);
  const [activities, setActivities] = useState<Activite[]>([]);
  const [mandats, setMandats] = useState<Mandat[]>([]);

  // Modifié pour accepter les données du backend
  const handleLogin = (selectedRole: 'admin' | 'member', userData: any) => {
    setRole(selectedRole);
    setUser(userData); // On sauvegarde le vrai nom et email depuis MySQL
    setPage(selectedRole === 'admin' ? 'admin-dash' : 'member-dash');
  };

  const handleCreateActivity = (newAct: Activite) => {
    // Plus tard, il faudra faire un fetch('.../api/activites', { method: 'POST' }) ici
    setActivities([newAct, ...activities]);
    setPage('admin-dash');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setUser(null);
    setPage('login');
  }

  if (page === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-500 p-2 rounded-lg shrink-0 shadow-lg shadow-indigo-500/30"><Users size={20} /></div>
          {sidebarOpen && <span className="font-bold tracking-tight text-xl text-white">CT-LIPN</span>}
        </div>
        <nav className="p-3 space-y-2 mt-6">
          {role === 'admin' ? (
            <>
              <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={page === 'admin-dash'} onClick={() => setPage('admin-dash')} showLabel={sidebarOpen} />
              <NavItem icon={<Users size={20}/>} label="Membres" active={page === 'admin-members'} onClick={() => setPage('admin-members')} showLabel={sidebarOpen} />
              <NavItem icon={<Briefcase size={20}/>} label="Mandats" active={page === 'admin-mandats'} onClick={() => setPage('admin-mandats')} showLabel={sidebarOpen} />
              <NavItem icon={<Plus size={20}/>} label="Nouvelle Activité" active={page === 'admin-new-act'} onClick={() => setPage('admin-new-act')} showLabel={sidebarOpen} />
            </>
          ) : (
            <NavItem icon={<LayoutDashboard size={20}/>} label="Mes Missions" active={page === 'member-dash'} onClick={() => setPage('member-dash')} showLabel={sidebarOpen} />
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-500 pt-28 pb-16 px-10 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className={`fixed top-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 transition-all flex items-center justify-between px-12 ${sidebarOpen ? 'left-64' : 'left-20'}`}>
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm"><MoreVertical size={20}/></button>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {page === 'admin-dash' ? "Tableau de Bord" : page === 'admin-members' ? "Membres" : page === 'admin-mandats' ? "Mandats" : "Espace Personnel"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 relative transition-all group border border-slate-100">
              <Bell size={22}/><span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>
            <div className="flex items-center gap-4 group cursor-pointer border-l pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user?.nom || 'Utilisateur'}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Shield size={10} className="text-indigo-500" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 group-hover:scale-105 transition-all">
                {user?.nom ? user.nom.charAt(0) : 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {page === 'admin-dash' && <AdminDashboard members={members} />}
          {page === 'admin-members' && (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-10">
              <h3 className="text-2xl font-black mb-6">Gestion du personnel</h3>
              <p className="text-slate-400 italic">Vous devrez faire un appel fetch() à votre backend MySQL pour remplir cette liste.</p>
            </div>
          )}
          {page === 'admin-mandats' && <AdminMandats mandats={mandats} />}
          {page === 'admin-new-act' && <CreateActivityForm onCancel={() => setPage('admin-dash')} onCreate={handleCreateActivity} />}
          
          {page === 'member-dash' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 p-12 rounded-[50px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-4 tracking-tight">Bonjour, {user?.nom || 'Docteur'} 👋</h2>
                    <p className="text-indigo-100 text-lg font-medium opacity-80">Ravi de vous revoir. Vous avez {activities.length} activités dans votre planning.</p>
                  </div>
                </div>

                {activities.length === 0 ? (
                  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 italic">Aucune activité assignée pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activities.map(act => (
                      <div key={act.id} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                          <span className="bg-cyan-100 text-cyan-600 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">{act.type}</span>
                          <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase shadow-sm ${act.statut === 'En cours' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{act.statut}</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight flex-1">{act.description}</h4>
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-sm mt-8 p-4 bg-slate-50 rounded-2xl">
                          <Calendar size={18} className="text-indigo-500" /> {act.dateEcheance}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          )}
        </div>
      </main>

      {/* Bouton de déconnexion */}
      <button onClick={handleLogout} className="fixed bottom-8 right-8 w-16 h-16 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white border border-slate-100 transition-all hover:rotate-12 group z-50">
        <LogOut size={28} className="group-hover:scale-110 transition-transform"/>
      </button>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, showLabel }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
    {icon} {showLabel && <span className="text-sm font-semibold">{label}</span>}
  </button>
);