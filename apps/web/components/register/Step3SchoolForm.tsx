'use client';

// components/register/Step3SchoolForm.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from 'shared/enums';
import { IRegisterFormData, IRegisterPayload } from 'shared/interfaces/register.interface';
import { getStep3Schema } from '@/app/validation/Register.validation';
import { useStepValidation } from '@/app/hook/Usestepvalidation';
import { useAuth } from '@/context/AuthContext';
import { getEtablissementCities, getEtablissementsByCity, Etablissement } from '@/lib/services/etablissement';

interface Props {
  formData: IRegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<IRegisterFormData>>;
  prevStep: () => void;
  setError: (msg: string) => void;
}

export default function Step3SchoolForm({ formData, setFormData, prevStep, setError }: Props) {
  const router = useRouter();
  const { register } = useAuth();

  const profileData = formData.profileData as Record<string, any>;

  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState(profileData.ville || '');
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [selectedEtablissementId, setSelectedEtablissementId] = useState(
    profileData.etablissementId || '',
  );
  const [fetchMessage, setFetchMessage] = useState('');

  const isStudent = formData.role === UserRole.STUDENT;
  const isParent = formData.role === UserRole.PARENT;
  const isTeacher = formData.role === UserRole.TEACHER;

  // Schéma Yup dynamique selon le rôle
  const schema = getStep3Schema(formData.role) as unknown as any;
  const { fieldErrors, validate, clearError } = useStepValidation<any>(schema);

  // ─── Chargement villes ────────────────────────────────────────────────────
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await getEtablissementCities();
        setCities(data?.length ? data : []);
      } catch {
        setCities(['Casablanca', 'Rabat', 'Marrakech', 'Paris', 'Fès', 'Tanger']);
        setFetchMessage('Could not load cities — using fallback data.');
      }
    };
    loadCities();
  }, []);

  // ─── Chargement établissements quand ville change ─────────────────────────
  useEffect(() => {
    if (!city) { setEtablissements([]); setFetchMessage(''); return; }
    const load = async () => {
      try {
        const data = await getEtablissementsByCity(city);
        if (!data?.length) {
          setFetchMessage(`No establishments found for ${city}.`);
          setEtablissements([]);
        } else {
          setFetchMessage('');
          setEtablissements(data);
        }
      } catch {
        setFetchMessage(`Could not load establishments for ${city}.`);
      }
    };
    load();
  }, [city]);

  const updateProfileData = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      profileData: { ...prev.profileData, [key]: value },
    }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const submitForm = async () => {
    setError('');

    // Construit l'objet de validation selon le rôle
    const validationData = isParent
      ? { relation: profileData.relation }
      : {
        ville: city,
        etablissementId: selectedEtablissementId,
        ...(isStudent && { classe: profileData.classe }),
        ...(isTeacher && { matiere: profileData.matiere }),
      };

    const valid = await validate(validationData);
    if (!valid) {
      setError('Please fix the errors below.');
      return;
    }

    const finalProfileData = {
      ...formData.profileData,
      ville: city || profileData.ville,
      etablissementId: selectedEtablissementId || profileData.etablissementId,
    };

    // On ne renvoie PAS confirmPassword au backend
    const { confirmPassword: _omit, ...rest } = formData as any;
    const payload: IRegisterPayload = { ...rest, profileData: finalProfileData };

    try {
      setLoading(true);
    const result = await register(payload);

if(result?.role === UserRole.ADMIN){
   router.push("/dashboard/admin");
}
else if(result?.role === UserRole.TEACHER){
   router.push("/dashboard/teacher");
}
else if(result?.role === UserRole.STUDENT){
   router.push("/dashboard/student");
}
else if(result?.role === UserRole.PARENT){
   router.push("/dashboard/parent");
}
    } catch (ex: any) {
      setError(ex?.response?.data?.message || 'Registration failed. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Helpers UI ───────────────────────────────────────────────────────────
  const selectClass = (field: string) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${fieldErrors[field]
      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
      : 'border-gray-100 focus:ring-blue-100 focus:border-blue-400'
    }`;

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p> : null;

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Final Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Juste quelques détails supplémentaires propres à {formData.role.toLowerCase()}
        </p>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col gap-6 mb-8">

        {/* City — masquée pour Parent (pas d'établissement requis) */}
        {!isParent && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Select City</label>
            <select
              value={city}
              onChange={(e) => {
                const newCity = e.target.value;
                setCity(newCity);
                updateProfileData('ville', newCity);
                clearError('ville');
                setSelectedEtablissementId('');
                updateProfileData('etablissementId', '');
              }}
              className={selectClass('ville')}
            >
              <option value="">choisir ville</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <FieldError field="ville" />
            {fetchMessage && <p className="text-xs text-orange-500 mt-1">{fetchMessage}</p>}
          </div>
        )}

        {/* Establishment — masquée pour Parent */}
        {!isParent && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">choisir Establishment</label>
            <select
              value={selectedEtablissementId}
              onChange={(e) => {
                const newEtab = e.target.value;
                setSelectedEtablissementId(newEtab);
                updateProfileData('etablissementId', newEtab);
                clearError('etablissementId');
              }}
              className={selectClass('etablissementId')}
              disabled={!city}
            >
              <option value="">
                {!city ? 'Select a city first' : etablissements.length ? 'Select Establishment' : 'No Establishment Found'}
              </option>
              {etablissements.map((etab) => (
                <option key={etab._id} value={etab._id}>
                  {etab.nom} — {etab.code}
                </option>
              ))}
            </select>
            <FieldError field="etablissementId" />
          </div>
        )}

        {/* ── Role-specific fields ── */}

        {isStudent && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Class <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Section B"
              value={profileData.classe || ''}
              onChange={(e) => updateProfileData('classe', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {isParent && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Relationship <span className="text-red-400">*</span>
            </label>
            <select
              value={profileData.relation || ''}
              onChange={(e) => { updateProfileData('relation', e.target.value); clearError('relation'); }}
              className={selectClass('relation')}
            >
              <option value="" disabled>Select relationship</option>
              <option value="père">Père (Father)</option>
              <option value="mère">Mère (Mother)</option>
              <option value="tuteur">Tuteur (Guardian)</option>
              <option value="autre">Autre (Other)</option>
            </select>
            <FieldError field="relation" />
          </div>
        )}

        {isTeacher && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Subject <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Mathematics"
              value={profileData.matiere || ''}
              onChange={(e) => updateProfileData('matiere', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {/* Summary card */}
        <div className="bg-gray-50 rounded-xl p-4 mt-2 border border-gray-100 text-sm">
          <div className="flex justify-between border-b pb-2 mb-2">
            <span className="text-gray-500">Name</span>
            <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between border-b pb-2 mb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-bold text-gray-900">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-bold text-gray-900 capitalize">{formData.role.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={prevStep}
          disabled={loading}
          className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={submitForm}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              Submitting…
            </>
          ) : (
            <>
              Complete Registration
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}