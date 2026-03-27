'use client';

// components/register/Step1IdentityForm.tsx
import { useState } from 'react';
import { UserRole } from 'shared/enums';
import { IRegisterFormData } from 'shared/interfaces/register.interface';
import { step1Schema } from '@/app/validation/Register.validation';
import { useStepValidation } from '@/app/hook/Usestepvalidation';

type Step1Data = Pick<IRegisterFormData, 'role' | 'firstName' | 'lastName' | 'email'> & {
  acceptedTerms: boolean;
};

interface Props {
  formData: IRegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<IRegisterFormData>>;
  nextStep: () => void;
  setError: (msg: string) => void;
}

export default function Step1IdentityForm({ formData, setFormData, nextStep, setError }: Props) {
  const [firstName, setFirstName] = useState(formData.firstName || '');
  const [lastName, setLastName] = useState(formData.lastName || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { fieldErrors, validate, clearError } = useStepValidation<Step1Data>(step1Schema);

  const isStaff = formData.role === UserRole.TEACHER || formData.role === UserRole.ADMIN;

  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleContinue = async () => {
    setError('');

    const data: Step1Data = {
      role: formData.role,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: formData.email?.trim() || '',
      acceptedTerms,
    };

    const valid = await validate(data);
    if (!valid) {
      setError('Please fix the errors below before continuing.');
      return;
    }

    setFormData((prev) => ({ ...prev, firstName: data.firstName, lastName: data.lastName }));
    nextStep();
  };

  // ─── Helpers UI ──────────────────────────────────────────────────────────────
  const inputClass = (field: keyof Step1Data) =>
    `w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${fieldErrors[field]
      ? 'border-red-400 focus:ring-red-50 focus:border-red-500'
      : 'border-gray-100 focus:ring-blue-50 focus:border-blue-400'
    }`;

  const FieldError = ({ field }: { field: keyof Step1Data }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors[field]}</p>
    ) : null;

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Who are you?</h2>
        <p className="text-sm text-gray-500 mt-1">Select your role to help us tailor your experience.</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        {[
          {
            role: UserRole.STUDENT,
            label: 'Student',
            sub: 'Reporting for myself or peers',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            ),
          },
          {
            role: UserRole.PARENT,
            label: 'Parent',
            sub: 'Reporting for my child',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            role: UserRole.TEACHER,
            label: 'Staff',
            sub: 'Teacher or Administrator',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            ),
          },
        ].map(({ role, label, sub, icon }) => {
          const active = role === UserRole.TEACHER ? isStaff : formData.role === role;
          return (
            <div
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center text-center transition-all ${active ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
            >
              <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
              <p className="text-xs text-gray-500 mt-1">{sub}</p>
            </div>
          );
        })}
      </div>

      {/* Staff sub-role dropdown */}
      {isStaff && (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col gap-3 p-5 bg-blue-50/40 border-2 border-dashed border-blue-200 rounded-2xl">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">Specify your Staff Role</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                className="w-full appearance-none px-4 py-3.5 bg-white border border-blue-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value={UserRole.TEACHER}>Teacher</option>
                <option value={UserRole.ADMIN}>School Administrator / Director</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
            <p className="text-[11px] text-blue-500/80 px-1 font-medium leading-relaxed">
              * Choosing <strong>Administrator</strong> grants authority to oversee school-level safety metrics.
            </p>
          </div>
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 ml-1">First Name</label>
          <input
            type="text"
            placeholder="e.g. Jean"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
            className={inputClass('firstName')}
          />
          <FieldError field="firstName" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 ml-1">Last Name</label>
          <input
            type="text"
            placeholder="e.g. Dupont"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
            className={inputClass('lastName')}
          />
          <FieldError field="lastName" />
        </div>
      </div>

      {/* Email field */}
      <div className="w-full mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 ml-1">School Email Address</label>
          <input
            type="email"
            placeholder="yourname@school.edu"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
              clearError('email');
            }}
            className={inputClass('email')}
          />
          <FieldError field="email" />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-4 w-full mb-8 bg-blue-50/20 p-4 rounded-xl border border-blue-50/50">
        <div className="pt-0.5">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => { setAcceptedTerms(e.target.checked); clearError('acceptedTerms'); }}
            className="w-5 h-5 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <label htmlFor="terms" className="cursor-pointer select-none flex-1">
          <p className="text-sm font-bold text-gray-900 leading-tight">Confidentiality Guarantee</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            I understand that all information provided is protected under our{' '}
            <a href="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Shield</a> program.
          </p>
          {fieldErrors.acceptedTerms && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.acceptedTerms}</p>
          )}
        </label>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full border-t border-gray-50 pt-8 mt-2">
        <button
          onClick={() => (window.location.href = '/login')}
          className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          className="px-10 py-4 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center gap-3"
        >
          Continue Registration
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}