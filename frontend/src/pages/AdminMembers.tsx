import React from "react";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import type { Membre } from "../types";

interface Props {
  members: Membre[];
}

export default function AdminMembers({ members }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-xl font-bold">Liste des membres</h3>

        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <UserPlus size={18} />
          Nouveau membre
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
              Nom
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">
              Rôle
            </th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {members.map((membre) => (
            <tr
              key={membre.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">
                  {membre.nom}
                </div>
                <div className="text-xs text-slate-400">
                  {membre.email}
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    membre.role === "Administrateur"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {membre.role}
                </span>
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
  );
}