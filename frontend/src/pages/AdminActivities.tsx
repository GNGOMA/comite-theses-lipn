import React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Activite } from "../types";

interface Props {
  activities: Activite[];
}

export default function AdminActivities({ activities }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-bold">Liste des activités</h3>

        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus size={18} />
          Nouvelle activité
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Description
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Doctorant
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Échéance
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Statut
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
                Assigné à
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-100 text-cyan-600">
                    {activity.type}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">
                    {activity.description}
                  </div>
                  <div className="text-xs text-slate-400">
                    Créée le {activity.dateCreation}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600 font-medium">
                  {activity.doctorant || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600 font-medium">
                  {activity.dateEcheance}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      activity.statut === "Terminé"
                        ? "bg-emerald-100 text-emerald-600"
                        : activity.statut === "En cours"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {activity.statut}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600 font-medium">
                  {activity.assigne}
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}