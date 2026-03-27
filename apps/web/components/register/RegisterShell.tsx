'use client';


import { useState } from 'react';
import { UserRole } from 'shared/enums';
import { IRegisterFormData } from 'shared/interfaces';
import Step1IdentityForm from './Step1IdentityForm';
import Step2DetailsForm from './Step2DetailsForm';
import Step3SchoolForm from './Step3SchoolForm';

const STEPS = [
  { label: 'Identity' },
  { label: 'Details' },
  { label: 'School' },
];

export default function RegisterShell() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<IRegisterFormData>({
    role: UserRole.STUDENT,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    profileData: {},
  });

  const nextStep = () => { setError(''); setStep((p) => p + 1); };
  const prevStep = () => { setError(''); setStep((p) => p - 1); };

  return (
    <div className="w-full max-w-2xl mx-auto border-2 border-blue-400 rounded-lg bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b]">Create Your Account</h1>
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
          Step {step} of {STEPS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const active = step >= n;
          return (
            <div key={s.label} className="flex-1 flex flex-col gap-1">
              <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <Step1IdentityForm formData={formData} setFormData={setFormData} nextStep={nextStep} setError={setError} />
      )}
      {step === 2 && (
        <Step2DetailsForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} setError={setError} />
      )}
      {step === 3 && (
        <Step3SchoolForm formData={formData} setFormData={setFormData} prevStep={prevStep} setError={setError} />
      )}

      {/* Trust Badges */}
      <div className="absolute bottom-[-35px] left-0 w-full flex justify-center items-center gap-8 text-[10px] uppercase font-bold text-gray-400">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          END-TO-END ENCRYPTED
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
          VERIFIED IDENTITY
        </div>
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
          ANONYMOUS OPTIONS
        </div>
      </div>
    </div>
  );
}