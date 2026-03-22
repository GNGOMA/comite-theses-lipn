import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Activite } from "../types";

const API_URL = "http://127.0.0.1:8000";

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activite>>({});

  // Form state
  const [formData, setFormData] = useState<{
    type: string;
    description: string;
    doctorant: string;
    dateEcheance: string;
    statut: string;
    assigne: string;
  }>({
    type: "",
    description: "",
    doctorant: "",
    dateEcheance: "",
    statut: "En cours",
    assigne: "",
  });

  // Charger les activités
  useEffect(() => {
    fetch(`${API_URL}/activites`)
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Ajouter une activité
  const handleAddActivity = () => {
    fetch(`${API_URL}/activites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, dateCreation: new Date().toISOString().slice(0, 10) }),
    })
      .then(res => res.json())
      .then(added => setActivities([...activities, added]))
      .finally(() => {
        setShowAddModal(false);
        setFormData({ type: "", description: "", doctorant: "", dateEcheance: "", statut: "En cours", assigne: "" });
      });
  };

  // Supprimer une activité
  const handleDeleteActivity = (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return;

    fetch(`${API_URL}/activites/${id}`, { method: "DELETE" })
      .then(() => setActivities(activities.filter(a => a.id !== id)))
      .catch(err => console.error(err));
  };

  // Ouvrir modal modification
  const openEditModal = (activity: Activite) => {
    setCurrentActivity(activity);
    setFormData({
      type: activity.type,
      description: activity.description,
      doctorant: activity.doctorant || "",
      dateEcheance: activity.dateEcheance,
      statut: activity.statut,
      assigne: activity.assigne || "",
    });
    setShowEditModal(true);
  };

  // Modifier une activité
  const handleEditActivity = () => {
    fetch(`${API_URL}/activites/${currentActivity.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(updated => setActivities(activities.map(a => (a.id === updated.id ? updated : a))))
      .finally(() => setShowEditModal(false));
  };

  if (loading) return <div>Chargement des activités...</div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 p-6">
      {/* Header et bouton Ajouter */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Liste des activités</h3>
        <button
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Nouvelle activité
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Description</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Doctorant</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Échéance</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Statut</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Assigné à</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activities.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">{a.type}</td>
                <td className="px-6 py-4">{a.description}</td>
                <td className="px-6 py-4">{a.doctorant || "-"}</td>
                <td className="px-6 py-4">{a.dateEcheance}</td>
                <td className="px-6 py-4">{a.statut}</td>
                <td className="px-6 py-4">{a.assigne || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(a)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteActivity(a.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Ajouter une activité</h2>
            <input placeholder="Type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Doctorant" value={formData.doctorant || ""} onChange={e => setFormData({...formData, doctorant: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input type="date" placeholder="Échéance" value={formData.dateEcheance} onChange={e => setFormData({...formData, dateEcheance: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Assigné à" value={formData.assigne || ""} onChange={e => setFormData({...formData, assigne: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})} className="mb-4 w-full border p-2 rounded">
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={handleAddActivity} className="bg-indigo-600 text-white px-4 py-2 rounded">Ajouter</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Modifier l'activité</h2>
            <input placeholder="Type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Doctorant" value={formData.doctorant || ""} onChange={e => setFormData({...formData, doctorant: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input type="date" placeholder="Échéance" value={formData.dateEcheance} onChange={e => setFormData({...formData, dateEcheance: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <input placeholder="Assigné à" value={formData.assigne || ""} onChange={e => setFormData({...formData, assigne: e.target.value})} className="mb-2 w-full border p-2 rounded"/>
            <select value={formData.statut} onChange={e => setFormData({...formData, statut: e.target.value})} className="mb-4 w-full border p-2 rounded">
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={handleEditActivity} className="bg-indigo-600 text-white px-4 py-2 rounded">Enregistrer</button>
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}