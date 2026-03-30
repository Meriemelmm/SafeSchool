
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SignalementCreateView from '@/components/signalement/SignalementCreateView';
import { signalementService } from '@/lib/services/signalement';
import { signalementMemberService } from '@/lib/services/signalement-member';
import { SignalementFormData, MemberFormData } from '@/components/signalement/create/types';
import { ISignalement, ISignalementMember } from 'shared/interfaces/signalement.interface';
import { Loader2 } from 'lucide-react';

export default function EditSignalementPage() {
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState<SignalementFormData | undefined>();
    const [initialMembers, setInitialMembers] = useState<MemberFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [signalementRes, membersRes] = await Promise.all([
                    signalementService.getOne(id),
                    signalementMemberService.getBySignalement(id)
                ]);

                const signalement = signalementRes.data;

                // Transformer les données du signalement au format du formulaire
                const formData: SignalementFormData = {
                    title: signalement.title,
                    description: signalement.description,
                    nature: signalement.nature,
                    typeViolence: signalement.typeViolence,
                    gravite: signalement.gravite,
                    isAnonymous: signalement.isAnonymous || false,
                    dateIncident: new Date(signalement.dateIncident).toISOString().split('T')[0],
                    location: signalement.location,
                };

                setInitialData(formData);

                // Transformer les membres au format du formulaire
                if (membersRes.data && Array.isArray(membersRes.data)) {
                    const members: MemberFormData[] = membersRes.data.map((member: ISignalementMember) => ({
                        firstName: member.firstName,
                        lastName: member.lastName,
                        role: member.role,
                    }));
                    setInitialMembers(members);
                }
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    'Erreur lors du chargement du signalement'
                );
                console.error('Erreur chargement signalement:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Chargement du signalement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <SignalementCreateView
            editingId={id}
            initialData={initialData}
            initialMembers={initialMembers}
        />
    );
}