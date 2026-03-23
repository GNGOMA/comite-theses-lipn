import React, { useState } from 'react';
import { Users, CheckCircle, UserPlus, ArrowRight, ShieldCheck, Lock, ChevronLeft, UserCircle } from 'lucide-react';

type ViewState = 'selection' | 'login' | 'register';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'member', userData: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
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
      setError("Erreur : Impossible de joindre le serveur MySQL. Vérifiez que le backend Python tourne.");
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
      setError("Erreur : Impossible de joindre le serveur MySQL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
        
        {/* ==================================================== */}
        {/* VUE 1 : CHOIX DU PROFIL */}
        {/* ==================================================== */}
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
              <button onClick={() => handleRoleSelection('admin')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 group text-lg">
                Accès Administrateur <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => handleRoleSelection('member')} className="w-full bg-white border-2 border-slate-100 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 font-bold py-5 rounded-3xl transition-all text-lg">
                Accès Membre du Comité
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* VUE 2 : CONNEXION */}
        {/* ==================================================== */}
        {view === 'login' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => { setView('selection'); setError(''); setSuccessMsg(''); }} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
              <ChevronLeft size={16} /> Changer de profil
            </button>

            <div className="text-center mb-8">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <UserCircle className="text-slate-400" size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Connexion {selectedRole === 'admin' ? 'Admin' : 'Membre'}</h2>
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
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="votre.nom@lipn.fr" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative">
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-12" placeholder="••••••••" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                {loading ? "Vérification..." : "Valider l'accès"} {!loading && <ArrowRight size={20} />}
              </button>
            </form>

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

        {/* ==================================================== */}
        {/* VUE 3 : INSCRIPTION */}
        {/* ==================================================== */}
        {view === 'register' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => { setView('login'); setError(''); }} className="mb-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
              <ChevronLeft size={16} /> Retour à la connexion
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nouveau {selectedRole === 'admin' ? 'Administrateur' : 'Membre'}</h2>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: Jean Dupont" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="votre.nom@lipn.fr" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative">
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-12" placeholder="••••••••" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                {loading ? "Création en cours..." : "S'inscrire"} {!loading && <UserPlus size={20} />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}