'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from 'shared/index';
import { X, UserPlus, Mail, Shield, Smartphone, GraduationCap, School, BookOpen, Users, Key } from 'lucide-react';
import { userService } from '@/lib/services/users';
import { getAllEtablissements, Etablissement } from '@/lib/services/etablissement';

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.STUDENT as UserRole,
  });

  const [profileData, setProfileData] = useState<any>({});
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const data = await getAllEtablissements();
        setEtablissements(data);
      } catch (err) {
        console.error('Failed to fetch etablissements:', err);
      }
    };
    fetchEtablissements();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const fieldName = name.split('.')[1];
      setProfileData((prev: any) => ({ ...prev, [fieldName]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setFormData(prev => ({ ...prev, role: newRole }));
    // Reset profile data when role changes
    setProfileData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      profileData: {
        ...profileData,
        // Ensure classes is an array for teacher
        ...(formData.role === UserRole.TEACHER && profileData.classes ? { 
          classes: typeof profileData.classes === 'string' ? profileData.classes.split(',').map((s: string) => s.trim()) : profileData.classes 
        } : {})
      }
    };

    try {
      await userService.createUser(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileFields = () => {
    switch (formData.role) {
      case UserRole.STUDENT:
        return (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><School className="w-3.5 h-3.5" /> Établissement</label>
              <select
                name="profile.etablissementId"
                value={profileData.etablissementId || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Sélectionnez un établissement</option>
                {etablissements.map(e => (
                  <option key={e._id} value={e._id}>{e.nom}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Classe</label>
              <input
                type="text"
                name="profile.classe"
                value={profileData.classe || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: 2nde A"
              />
            </div>
          </div>
        );
      case UserRole.TEACHER:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><School className="w-3.5 h-3.5" /> Établissement</label>
              <select
                name="profile.etablissementId"
                required
                value={profileData.etablissementId || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Sélectionnez un établissement</option>
                {etablissements.map(e => (
                  <option key={e._id} value={e._id}>{e.nom}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Matière</label>
                <input
                  type="text"
                  name="profile.matiere"
                  value={profileData.matiere || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ex: Mathématiques"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Classes (Séparées par virgule)</label>
                <input
                  type="text"
                  name="profile.classes"
                  value={profileData.classes || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ex: 5è B, 4è C"
                />
              </div>
            </div>
          </div>
        );
      case UserRole.PARENT:
        return (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
            <label className="text-xs font-semibold text-gray-500 uppercase">Relation</label>
            <select
              name="profile.relation"
              required
              value={profileData.relation || 'père'}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="père">Père</option>
              <option value="mère">Mère</option>
              <option value="tuteur">Tuteur</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        );
      case UserRole.ADMIN:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><School className="w-3.5 h-3.5" /> Établissement (Optionnel)</label>
              <select
                name="profile.etablissementId"
                value={profileData.etablissementId || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Aucun - Administrateur Global</option>
                {etablissements.map(e => (
                  <option key={e._id} value={e._id}>{e.nom}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 id="canManageAll" 
                 checked={profileData.canManageAll === 'true' || profileData.canManageAll === true}
                 onChange={(e) => setProfileData((p: any) => ({ ...p, canManageAll: e.target.checked }))}
                 className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
               />
               <label htmlFor="canManageAll" className="text-sm font-medium text-gray-700">Gestion de tous les établissements</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-7 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">Nouvel Utilisateur</h2>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Configuration du compte</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl animate-shake flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Role selection at top */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Choisir un type de compte
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
               {[
                 { id: UserRole.STUDENT, label: 'Élève', icon: GraduationCap },
                 { id: UserRole.TEACHER, label: 'Professeur', icon: BookOpen },
                 { id: UserRole.PARENT, label: 'Parent', icon: Users },
                 { id: UserRole.ADMIN, label: 'Admin', icon: Shield },
               ].map((roleOption) => (
                 <button
                   key={roleOption.id}
                   type="button"
                   onClick={() => handleRoleChange({ target: { value: roleOption.id } } as any)}
                   className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 ${
                     formData.role === roleOption.id 
                       ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                       : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-white'
                   }`}
                 >
                   <roleOption.icon className={`w-6 h-6 ${formData.role === roleOption.id ? 'text-white' : 'text-gray-400'}`} />
                   <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">{roleOption.label}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-5 pt-2 border-t border-gray-50">
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Adresse Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="email@exemple.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Téléphone (Facultatif)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="06... (Format Marocain)"
              />
            </div>

            {/* Dynamic Profile Fields Section */}
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-4">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[2px]">Détails spécifique au rôle</h4>
              {renderProfileFields()}
            </div>
          </div>
        </form>

        <div className="p-7 border-t border-gray-50 bg-gray-50/50 flex gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-white hover:border-gray-300 transition-all active:scale-95"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] px-6 py-4 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 active:transform active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sauvegarder
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeWidth="2" strokeLinecap="round" d="M12 8v4m0 4h.01" />
  </svg>
);
