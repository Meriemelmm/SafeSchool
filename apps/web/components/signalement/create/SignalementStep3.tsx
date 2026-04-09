'use client';

import React from 'react';
import { Users, Plus, Trash2, UserCircle2, Info } from 'lucide-react';
import { RoleIncident } from 'shared/enums/roleIncedent.enum';
import { MemberFormData } from './types';

interface Props {
  members: MemberFormData[];
  onChange: (members: MemberFormData[]) => void;
}

const ROLE_OPTIONS: { value: RoleIncident; label: string; color: string }[] = [
  { value: RoleIncident.VICTIME,            label: 'Victime',              color: 'text-blue-600 bg-blue-50' },
  { value: RoleIncident.AUTEUR_PRESUME,     label: 'Auteur présumé',       color: 'text-red-600 bg-red-50' },
  { value: RoleIncident.TEMOIN,             label: 'Témoin',               color: 'text-amber-600 bg-amber-50' },
  { value: RoleIncident.PERSONNEL_EN_CHARGE,label: 'Personnel responsable', color: 'text-green-600 bg-green-50' },
];

export default function SignalementStep3({ members, onChange }: Props) {
  const addMember = () => {
    onChange([...members, { firstName: '', lastName: '', role: RoleIncident.VICTIME }]);
  };

  const updateMember = (index: number, field: keyof MemberFormData, value: string) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(updated);
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">
          Ajoutez les personnes impliquées dans l'incident.
        </p>
        <button
          type="button"
          onClick={addMember}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* ── Avertissement optionnel ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs font-semibold text-amber-700">
          Cette étape est <span className="font-black">facultative</span>. Vous pouvez la ignorer si vous ne souhaitez pas nommer les personnes impliquées.
        </p>
      </div>

      {/* ── État vide ── */}
      {members.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
          onClick={addMember}
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Users className="w-8 h-8 text-gray-200 group-hover:text-indigo-400 transition-colors" />
          </div>
          <p className="text-sm font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">
            Aucun membre ajouté
          </p>
          <p className="text-xs text-gray-300 font-medium mt-1 text-center">
            Cliquez ici ou sur le bouton ci-dessus pour ajouter une personne
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {members.map((member, index) => {
            const roleInfo = ROLE_OPTIONS.find(r => r.value === member.role);
            return (
              <div key={index} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                {/* Header membre */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <UserCircle2 className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {member.firstName || member.lastName
                          ? `${member.firstName} ${member.lastName}`.trim()
                          : `Membre ${index + 1}`}
                      </p>
                      {roleInfo && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Champs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Prénom</label>
                    <input
                      type="text"
                      value={member.firstName}
                      onChange={e => updateMember(index, 'firstName', e.target.value)}
                      placeholder="Prénom"
                      className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-gray-200 placeholder:font-normal shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nom</label>
                    <input
                      type="text"
                      value={member.lastName}
                      onChange={e => updateMember(index, 'lastName', e.target.value)}
                      placeholder="Nom de famille"
                      className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-gray-200 placeholder:font-normal shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Rôle</label>
                    <select
                      value={member.role}
                      onChange={e => updateMember(index, 'role', e.target.value as RoleIncident)}
                      className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all appearance-none shadow-sm"
                    >
                      {ROLE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
