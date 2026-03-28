'use client';

import React, { useState } from 'react';
import { EtablissementType } from 'shared/index';
import { X, Building2, RefreshCw } from 'lucide-react';
import { etablissementService, Etablissement } from '@/lib/services/etablissement';

interface CreateEtablissementFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  etablissement?: Etablissement;
}

export const CreateEtablissementForm: React.FC<CreateEtablissementFormProps> = ({ onSuccess, onCancel, etablissement }) => {
  const isEditing = !!etablissement;
  
  const [formData, setFormData] = useState({
    nom: etablissement?.nom || '',
    adresse: etablissement?.adresse || '',
    ville: etablissement?.ville || '',
    code: etablissement?.code || '',
    type: etablissement?.type || EtablissementType.ECOLE,
    telephone: etablissement?.telephone || '',
    email: etablissement?.email || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && etablissement?._id) {
        await etablissementService.updateEtablissement(etablissement._id, formData);
      } else {
        await etablissementService.createEtablissement(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Modifier l\'établissement' : 'Nouvel Établissement'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Nom de l'école</label>
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Code</label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                disabled={isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value={EtablissementType.ECOLE}>École</option>
                <option value={EtablissementType.COLLEGE}>Collège</option>
                <option value={EtablissementType.LYCEE}>Lycée</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Ville</label>
              <input
                type="text"
                name="ville"
                required
                value={formData.ville}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Adresse</label>
              <input
                type="text"
                name="adresse"
                required
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (isEditing ? 'Sauvegarder' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
