"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfile } from '@/lib/services/auth';
import { User, Mail, Shield, Calendar, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data.user);
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-4 text-red-600">
                Impossible de charger les données du profil.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Header Section */}
                <div className="bg-blue-600 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <User size={48} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                            <p className="opacity-80 uppercase tracking-widest text-sm font-semibold mt-1">
                                {profile.role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold border-b pb-2 mb-6 text-gray-800">Informations Personnelles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prénom</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.firstName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom</label>
                                <p className="text-gray-900 font-medium text-lg">{profile.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                                <div className="flex items-center gap-2 text-gray-900 font-medium text-lg">
                                    <Mail size={18} className="text-blue-500" />
                                    {profile.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone</label>
                                <div className="flex items-center gap-2 text-gray-900 font-medium text-lg">
                                    <Phone size={18} className="text-blue-500" />
                                    {profile.phone || 'Non renseigné'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold border-b pb-2 mb-6 text-gray-800">Données de Profil</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rôle</label>
                                <div className="flex items-center gap-2 text-gray-900 font-medium text-lg">
                                    <Shield size={18} className="text-blue-500" />
                                    <span className="capitalize">{profile.role}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID Utilisateur</label>
                                <p className="text-gray-900 font-mono text-lg font-bold">#{profile._id.toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membre depuis</label>
                                <div className="flex items-center gap-2 text-gray-900 font-medium text-lg">
                                    <Calendar size={18} className="text-blue-500" />
                                    {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {profile.profileData && Object.keys(profile.profileData).length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold border-b pb-2 mb-6 text-gray-800">Données Spécifiques</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {Object.entries(profile.profileData).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{key}</label>
                                        <p className="text-gray-900 font-medium text-lg">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-6 flex justify-end">
                    <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                        Modifier le profil
                    </button>
                </div>
            </div>
        </div>
    );
}
