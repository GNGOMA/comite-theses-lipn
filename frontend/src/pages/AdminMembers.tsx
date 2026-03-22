import React, { useState } from "react";
import { UserPlus, Edit, Trash2, X } from "lucide-react";
import type { Membre } from "../types";

interface Props {
  members: Membre[];
  onAddMember: (newMember: Omit<Membre, "id">) => void;
  onDeleteMember: (id: number) => void; // <-- Ajout ici
  onEditMember: (member: Membre) => void; // <-- Ajout ici
}

export default function AdminMembers({ members, onAddMember, onDeleteMember, onEditMember }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Membre | null>(null); // Pour savoir si on édite
 const [formData, setFormData] = useState<{
  nom: string;
  email: string;
  role: "Membre" | "Administrateur";
  charge: number;
}>({
  nom: "",
  email: "",
  role: "Membre",
  charge: 0,
});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      // Si on est en train d'éditer
      onEditMember({ ...editingMember, ...formData });
    } else {
      // Sinon on ajoute
      onAddMember(formData);
    }
    closeModal();
  };
const openEditModal = (membre: Membre) => {
  setEditingMember(membre);
  setFormData({
    nom: membre.nom,
    email: membre.email,
    role: membre.role,
    charge: membre.charge,
  });
  setIsModalOpen(true);
};
const closeModal = () => {
  setIsModalOpen(false);
  setEditingMember(null);
  setFormData({
    nom: "",
    email: "",
    role: "Membre",
    charge: 0,
  });
};
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-bold">Liste des membres</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={18} />
          Nouveau membre
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Nom</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Rôle</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {members.map((membre) => (
            <tr key={membre.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">{membre.nom}</div>
                <div className="text-xs text-slate-400">{membre.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  membre.role === "Administrateur" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {membre.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => openEditModal(membre)}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Edit size={18} />
                </button>              <button 
                onClick={() => onDeleteMember(membre.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale d'ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingMember ? "Modifier le membre" : "Ajouter un membre"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Les inputs restent les mêmes car ils utilisent formData */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nom Complet</label>
                <input 
                  required
                  className="..." 
                  type="text" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Rôle</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.role}
                  onChange={(e) =>
                                  setFormData({
                                  ...formData,
                                  role: e.target.value as "Membre" | "Administrateur",
                      })
              }
                >
                  <option value="Membre">Membre</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="...">
                  Annuler
                </button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold">
                  {editingMember ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}