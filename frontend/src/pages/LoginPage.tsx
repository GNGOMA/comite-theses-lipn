import React from "react";
import { Users, ArrowRight } from "lucide-react";

interface Props {
  onLogin: (role: "admin" | "member") => void;
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Users className="text-indigo-600" size={40} />
          </div>

          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Comité des Thèses
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Laboratoire LIPN</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onLogin("admin")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
          >
            Accès Administrateur
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={() => onLogin("member")}
            className="w-full bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 font-bold py-4 rounded-2xl transition-all"
          >
            Accès Membre du Comité
          </button>
        </div>
      </div>
    </div>
  );
}