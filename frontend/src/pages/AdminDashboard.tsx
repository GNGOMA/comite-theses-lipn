import React, { useEffect, useState } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
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

interface MemberMetric {
  membre_id: number;
  nom: string;
  email: string;
  role: string;
  member_total_tasks: number;
  member_completed_tasks: number;
  task_distribution: number;
  completion_rate: number;
  real_contribution: number;
}

export default function AdminDashboard({ members }: Props) {
  const [stats, setStats] = useState<Stats>({
    total_membres: 0,
    total_en_cours: 0,
    total_terminees: 0,
  });

  const [memberMetrics, setMemberMetrics] = useState<MemberMetric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard/stats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Erreur API stats :", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard/member-metrics")
      .then((res) => {
        setMemberMetrics(res.data);
      })
      .catch((err) => {
        console.error("Erreur API member metrics :", err);
      })
      .finally(() => {
        setLoadingMetrics(false);
      });
  }, []);

  const renderMetricCard = (
    title: string,
    icon: React.ReactNode,
    dataKey: "task_distribution" | "completion_rate" | "real_contribution",
    colorClass: string
  ) => {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {icon}
          {title}
        </h3>

        {loadingMetrics ? (
          <p className="text-slate-500">Chargement...</p>
        ) : memberMetrics.length === 0 ? (
          <p className="text-slate-500">Aucune donnée disponible.</p>
        ) : (
          <div className="space-y-6">
            {memberMetrics.map((member) => {
              const value = member[dataKey];

              return (
                <div key={`${dataKey}-${member.membre_id}`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-700">{member.nom}</span>
                    <span className="text-slate-400 font-bold">
                      {value.toFixed(2)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    {dataKey === "task_distribution" && (
                      <span>
                        {member.member_total_tasks} tâche(s) affectée(s)
                      </span>
                    )}

                    {dataKey === "completion_rate" && (
                      <span>
                        {member.member_completed_tasks} / {member.member_total_tasks} tâche(s) terminée(s)
                      </span>
                    )}

                    {dataKey === "real_contribution" && (
                      <span>
                        {member.member_completed_tasks} tâche(s) terminée(s) dans l’équipe
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
            <h3 className="text-2xl font-black">{stats.total_membres}</h3>
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
            <h3 className="text-2xl font-black">{stats.total_en_cours}</h3>
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
            <h3 className="text-2xl font-black">{stats.total_terminees}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {renderMetricCard(
          "Répartition des tâches par membre",
          <BarChart3 className="text-indigo-600" />,
          "task_distribution",
          "bg-indigo-500"
        )}

        {renderMetricCard(
          "Taux d’avancement par membre",
          <Activity className="text-emerald-600" />,
          "completion_rate",
          "bg-emerald-500"
        )}

        {renderMetricCard(
          "Contribution réelle au travail terminé",
          <PieChart className="text-amber-600" />,
          "real_contribution",
          "bg-amber-500"
        )}
      </div>
    </div>
  );
}