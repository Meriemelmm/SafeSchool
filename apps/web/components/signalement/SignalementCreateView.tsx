'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  Users,
  FileUp,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { signalementService } from '@/lib/services/signalement';
import { signalementMemberService } from '@/lib/services/signalement-member';
import { SignalementFormData, MemberFormData, INITIAL_FORM_DATA } from './create/types';
import { preuveService } from '@/lib/services/preuve';
import SignalementStep1 from './create/SignalementStep1';
import SignalementStep2 from './create/SignalementStep2';
import SignalementStep3 from './create/SignalementStep3';
import SignalementStep4 from './create/SignalementStep4';

// ─── Step Config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Détails de l\'incident', icon: ShieldCheck },
  { id: 2, label: 'Date & Localisation', icon: MapPin },
  { id: 3, label: 'Membres impliqués', icon: Users, optional: true },
  { id: 4, label: 'Preuves', icon: FileUp, optional: true },
];

// ─── Validation ────────────────────────────────────────────────────────────────
function validate(step: number, data: SignalementFormData): string | null {
  if (step === 1) {
    if (!data.title || data.title.trim().length < 5)
      return 'Le titre du rapport doit contenir au moins 5 caractères.';
    if (!data.description || data.description.trim().length < 10)
      return 'La description doit contenir au moins 10 caractères.';
  }
  if (step === 2) {
    if (!data.dateIncident) return 'La date de l\'incident est obligatoire.';
    if (!data.location || data.location.trim().length < 2)
      return 'Le lieu de l\'incident est obligatoire.';
  }
  return null;
}

interface SignalementCreateViewProps {
  editingId?: string;
  initialData?: SignalementFormData;
  initialMembers?: MemberFormData[];
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SignalementCreateView({ editingId, initialData, initialMembers }: SignalementCreateViewProps = {}) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignalementFormData>(initialData || INITIAL_FORM_DATA);
  const [members, setMembers] = useState<MemberFormData[]>(initialMembers || []);
  //   const [files, setFiles]       = useState<File[]>([]);
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!editingId;

  // ── Form data handler ──
  const handleFormChange = (partial: Partial<SignalementFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  };

  // ── Navigation ──
  const goNext = () => {
    const err = validate(currentStep, formData);
    if (err) { setError(err); return; }
    setError(null);
    setCurrentStep(s => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError(null);
    setCurrentStep(s => Math.max(s - 1, 1));
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        nature: formData.nature,
        typeViolence: formData.typeViolence,
        gravite: formData.gravite,
        isAnonymous: formData.isAnonymous,
        dateIncident: new Date(formData.dateIncident).toISOString(),
        location: formData.location.trim(),
      };

      let signalementId: string;

      if (isEditing) {
        // ── Mode Édition : Mettre à jour le signalement existant ─────────────────
        await signalementService.update(editingId, payload);
        signalementId = editingId;
      } else {
        // ── Mode Création : Créer un nouveau signalement ─────────────────────────
        const { data: created } = await signalementService.create(payload);
        signalementId = created._id;
      }

      const promises: Promise<any>[] = [];

      if (members.length > 0) {
        // POST /signalement-member  → { signalementId, members }
        promises.push(
          signalementMemberService.addMembers(signalementId, members)
        );
      }

      if (files.length > 0) {
        // POST /preuve — multipart : signalementId (body) + files[]
        promises.push(
          preuveService.uploadFiles(signalementId, files.map(f => f.file))
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      const currentPath = window.location.pathname;
      if (currentPath.includes('/student')) {
        router.push('/dashboard/student/signalement');
      } else if (currentPath.includes('/parent')) {
        router.push('/dashboard/parent/signalement');
      } else {
        router.push('/dashboard/student/signalement');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Une erreur est survenue lors de la soumission du signalement.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = currentStep === STEPS.length;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F6FA] py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-x-0.5 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {isEditing ? 'Modifier le Signalement' : 'Nouveau Signalement'}
              </h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.18em] mt-0.5">
                SYSTÈME DE SIGNALEMENT V2.4
              </p>
            </div>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="relative flex items-start justify-between mb-12 px-2">
          {/* connector line */}
          <div className="absolute top-5 left-4 right-4 h-px bg-gray-200 -z-0" />
          <div
            className="absolute top-5 left-4 h-px bg-indigo-600 transition-all duration-700 ease-in-out -z-0"
            style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 0px)` }}
          />

          {STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center z-10 gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50'
                      : isComplete
                        ? 'bg-white border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}
                >
                  {isComplete
                    ? <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    : <Icon className="w-4 h-4" />
                  }
                </div>
                <div className="text-center">
                  <span
                    className={`text-[10px] font-bold block whitespace-nowrap transition-colors
                      ${isActive ? 'text-indigo-600' : isComplete ? 'text-indigo-400' : 'text-gray-300'}`}
                  >
                    {step.label}
                  </span>
                  {step.optional && (
                    <span className="text-[9px] text-gray-300 font-semibold">facultatif</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-50">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Étape {currentStep} : {STEPS[currentStep - 1].label}
            </h2>
            <p className="text-sm text-gray-400 font-medium mt-1">
              {currentStep === 1 && 'Aidez-nous à comprendre ce qui s\'est passé avec des informations précises.'}
              {currentStep === 2 && 'Indiquez-nous quand et où l\'incident s\'est produit.'}
              {currentStep === 3 && 'Ajoutez les personnes impliquées — cette étape est facultative.'}
              {currentStep === 4 && 'Joignez des photos, vidéos ou documents pour appuyer votre signalement.'}
            </p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-semibold flex-grow">{error}</p>
                <button onClick={() => setError(null)} className="text-red-300 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step Components */}
            {currentStep === 1 && (
              <SignalementStep1 data={formData} onChange={handleFormChange} />
            )}
            {currentStep === 2 && (
              <SignalementStep2 data={formData} onChange={handleFormChange} />
            )}
            {currentStep === 3 && (
              <SignalementStep3 members={members} onChange={setMembers} />
            )}
            {currentStep === 4 && (
              <SignalementStep4 files={files} onChange={setFiles} />
            )}
          </div>

          {/* Card Footer */}
          <div className="px-8 pb-8 pt-2 flex items-center justify-between border-t border-gray-50">
            <button
              type="button"
              onClick={currentStep === 1 ? () => router.back() : goBack}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors px-4 py-3"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Annuler' : 'Retour'}
            </button>

            <button
              type="button"
              onClick={isLastStep ? handleSubmit : goNext}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : isLastStep ? (
                <>
                  {isEditing ? 'Mettre à jour' : 'Soumettre le rapport'}
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>Étape suivante <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* ── Footer badges ── */}
        <div className="flex justify-center items-center gap-8 mt-8 opacity-40">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Chiffrement de bout en bout
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Conforme RGPD
          </span>
        </div>

      </div>
    </div>
  );
}