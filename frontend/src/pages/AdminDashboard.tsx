import React from "react";
import { Users, Clock, CheckCircle, BarChart3 } from "lucide-react";
import type { Membre } from "../types";

interface Props {
  members: Membre[];
}

export default function AdminDashboard({ members }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-500 p-4 rounded-2xl text-white">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Membres
            </p>
            <h3 className="text-2xl font-black">15</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-500 p-4 rounded-2xl text-white">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              En cours
            </p>
            <h3 className="text-2xl font-black">28</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-500 p-4 rounded-2xl text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Terminées
            </p>
            <h3 className="text-2xl font-black">142</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" />
          Charge de travail par membre
        </h3>

        <div className="space-y-6">
          {members.map((member) => (
            <div key={member.id}>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700">{member.nom}</span>
                <span className="text-slate-400 font-bold">
                  {member.charge}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    member.charge > 80 ? "bg-red-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${member.charge}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}