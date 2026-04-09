'use client';

// components/register/Step2DetailsForm.tsx
import { useState } from 'react';
import { IRegisterFormData } from 'shared/interfaces/register.interface';
import { step2Schema } from '@/app/validation/Register.validation';
import { useStepValidation } from '@/app/hook/Usestepvalidation';

type Step2Data = {
  password: string;
  phone?: string;
};

interface Props {
  formData: IRegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<IRegisterFormData>>;
  nextStep: () => void;
  prevStep: () => void;
  setError: (msg: string) => void;
}

// ─── Password strength helper ─────────────────────────────────────────────────
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const map: Record<number, { label: string; color: string }> = {
    1: { label: 'Weak', color: 'bg-red-400' },
    2: { label: 'Fair', color: 'bg-orange-400' },
    3: { label: 'Good', color: 'bg-yellow-400' },
    4: { label: 'Strong', color: 'bg-green-500' },
  };
  return { score, ...(map[score] || { label: '', color: '' }) };
}

export default function Step2DetailsForm({ formData, setFormData, nextStep, prevStep, setError }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const { fieldErrors, validate, clearError } = useStepValidation<Step2Data>(step2Schema);

  const strength = getPasswordStrength(formData.password || '');

  const handleContinue = async () => {
    setError('');
    const data: Step2Data = {
      password: formData.password || '',
      phone: formData.phone,
    };

    const valid = await validate(data);
    if (!valid) {
      setError('Please fix the errors below before continuing.');
      return;
    }
    nextStep();
  };

  const inputClass = (field: keyof Step2Data) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${fieldErrors[field]
      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
      : 'border-gray-100 focus:ring-blue-100 focus:border-blue-400'
    }`;

  const FieldError = ({ field }: { field: keyof Step2Data }) =>
    fieldErrors[field] ? <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p> : null;

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Secure your account</h2>
        <p className="text-sm text-gray-500 mt-1">Create a strong password to protect your data.</p>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col gap-5 mb-8">

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={formData.password || ''}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                clearError('password');
              }}
              className={`${inputClass('password')} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>

          {/* Strength bar */}
          {formData.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
              {strength.label && (
                <span className="text-xs font-semibold text-gray-500">{strength.label}</span>
              )}
            </div>
          )}

          {/* Rules hint */}
          <div className="flex gap-4 mt-1">
            {[
              { ok: (formData.password?.length ?? 0) >= 8, label: '8+ chars' },
              { ok: /[A-Z]/.test(formData.password || ''), label: 'Uppercase' },
              { ok: /[0-9]/.test(formData.password || ''), label: 'Number' },
            ].map(({ ok, label }) => (
              <span key={label} className={`text-[11px] font-medium flex items-center gap-1 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                {ok ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>
                )}
                {label}
              </span>
            ))}
          </div>
          <FieldError field="password" />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">
            Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            placeholder="+212 600000000"
            value={formData.phone || ''}
            onChange={(e) => { setFormData((prev) => ({ ...prev, phone: e.target.value })); clearError('phone'); }}
            className={inputClass('phone')}
          />
          <FieldError field="phone" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={prevStep}
          className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}