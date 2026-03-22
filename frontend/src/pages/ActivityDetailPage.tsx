import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Upload, Plus, ChevronRight } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  description: string;
  dateCreation: string;
  dateEcheance: string;
  statut: string;
}

interface Props {
  activity: Activity | null;
  onBack: () => void;
}

export default function ActivityDetailPage({ activity, onBack }: Props) {
  const [statut, setStatut] = useState("En cours");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activity) {
      setStatut(activity.statut);
    }
  }, [activity]);

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-slate-600 font-semibold mb-4">
          Aucune activité sélectionnée.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          Retour
        </button>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/activites/${activity.id}/statut`, {
        statut: statut,
      });
      setMessage("Statut mis à jour avec succès");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du statut");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setMessage("Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("fichier", selectedFile);

    try {
      await axios.post(
        `http://127.0.0.1:8000/activites/${activity.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Fichier uploadé avec succès");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload du fichier");
    }
  };

  const handleSave = async () => {
    await handleUpdateStatus();
    if (selectedFile) {
      await handleUploadFile();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
      >
        <ChevronRight className="rotate-180" size={20} />
        Retour aux missions
      </button>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {activity.type}
            </span>

            <div className="text-right">
              <p className="text-xs font-black text-slate-300 uppercase">
                Échéance
              </p>
              <p className="text-lg font-black text-red-500">
                {activity.dateEcheance}
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {activity.description}
          </h2>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest">
                <Clock size={18} className="text-indigo-600" />
                État de la mission
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {["À faire", "En cours", "Terminé"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatut(s)}
                    className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                      s === statut
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-widest">
                <Upload size={18} className="text-indigo-600" />
                Dépôt de document
              </h4>

              <label className="border-3 border-dashed border-slate-100 rounded-[32px] p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 cursor-pointer group block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="text-indigo-600" size={24} />
                </div>

                <p className="text-sm font-bold text-slate-700">
                  Cliquer pour uploader
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  PDF uniquement
                </p>

                {selectedFile && (
                  <p className="mt-3 text-sm font-semibold text-indigo-600">
                    {selectedFile.name}
                  </p>
                )}
              </label>
            </div>
          </div>

          {message && (
            <p className="text-sm font-semibold text-slate-600">{message}</p>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase text-xs tracking-widest"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}