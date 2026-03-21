import React, { useEffect, useState } from "react";
import { Users, Clock, CheckCircle, BarChart3 } from "lucide-react";
import axios from "axios";
import type { Membre } from "../types";

interface Props {
  members: Membre[];
}

interface Stats {
  total_membres: number;
  total_en_cours: number;
  total_terminees: number;
}

export default function AdminDashboard({ members }: Props) {
  const [stats, setStats] = useState<Stats>({
    total_membres: 0,
    total_en_cours: 0,
    total_terminees: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Membres */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-500 p-4 rounded-2xl text-white">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Membres
            </p>
            <h3 className="text-2xl font-black">
              {stats.total_membres}
            </h3>
          </div>
        </div>

        {/* En cours */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-500 p-4 rounded-2xl text-white">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              En cours
            </p>
            <h3 className="text-2xl font-black">
              {stats.total_en_cours}
            </h3>
          </div>
        </div>

        {/* Terminées */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-500 p-4 rounded-2xl text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              Terminées
            </p>
            <h3 className="text-2xl font-black">
              {stats.total_terminees}
            </h3>
          </div>
        </div>
      </div>

      {/* Charge */}
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