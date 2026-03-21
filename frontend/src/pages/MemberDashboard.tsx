import React from "react";
import { Clock } from "lucide-react";
import type { Activite } from "../types";

interface Props {
  activities: Activite[];
  onSelect: () => void;
}

export default function MemberDashboard({ activities, onSelect }: Props) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200">
        <h2 className="text-3xl font-black mb-2">
          Bonjour, Dr. Jean Dupont
        </h2>
        <p className="text-indigo-100 font-medium">
          Vous avez {activities.length} activités en attente cette semaine.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.slice(0, 2).map((act) => (
          <div
            key={act.id}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
            onClick={onSelect}
          >
            <div className="flex justify-between items-start mb-6">
              
              <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {act.type}
              </span>

              <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase">
                {act.statut}
              </span>
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              {act.description}
            </h4>

            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-6">
              <Clock size={16} />
              Échéance : {act.dateEcheance}
            </div>

            <button className="mt-8 w-full bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              Mettre à jour
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}