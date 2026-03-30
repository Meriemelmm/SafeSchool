'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, AlertTriangle, ShieldAlert, Paperclip, Users, Clock, AlertCircle, Loader2, PlayCircle, Headphones, FileText, Edit } from 'lucide-react';
import { ISignalement, ISignalementMember, IPreuve } from 'shared/interfaces/signalement.interface';
import { signalementService } from '@/lib/services/signalement';
import { preuveService } from '@/lib/services/preuve';
import { signalementMemberService } from '@/lib/services/signalement-member';
import { StatutSignalement } from 'shared/enums/signalement-enums';
import { RoleIncident } from 'shared/enums/roleIncedent.enum';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from 'shared/enums/index';
import { TypeEpreuve } from 'shared/enums/index';


const STATUS_OPTIONS: { value: StatutSignalement; label: string }[] = [
  { value: StatutSignalement.NOUVEAU, label: 'Nouveau' },
  { value: StatutSignalement.EN_COURS, label: 'En Cours' },
  { value: StatutSignalement.EN_INVESTIGATION, label: 'Investigation' },
  { value: StatutSignalement.RESOLU, label: 'Résolu' },
  { value: StatutSignalement.REJETE, label: 'Rejeté' },
  { value: StatutSignalement.ESCALADE, label: 'Escaladé' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  signalement: ISignalement | null;
  onStatusChange: (updatedSignalement: ISignalement) => void;
  readOnly?: boolean;
}

const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export function SignalementDetailsModal({ isOpen, onClose, signalement, onStatusChange, readOnly = false }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'preuves' | 'membres'>('details');
  const [preuves, setPreuves] = useState<IPreuve[]>([]);
  const [members, setMembers] = useState<ISignalementMember[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);
  const [deletingPreuve, setDeletingPreuve] = useState<string | null>(null);
  const { user } = useAuth();

  const handleEditClick = () => {
    if (!signalement) return;
    // Fermer le modal d'abord
    onClose();

    // Puis naviguer vers la page d'édition
    setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/student')) {
        router.push(`/dashboard/student/signalement/edit/${signalement._id}`);
      } else if (currentPath.includes('/parent')) {
        router.push(`/dashboard/parent/signalement/edit/${signalement._id}`);
      } else {
        router.push(`/dashboard/student/signalement/edit/${signalement._id}`);
      }
    }, 0);
  };

  useEffect(() => {
    if (isOpen && signalement) {
      loadAdditionalData();
    }

  }, [isOpen, signalement]);

  const loadAdditionalData = async () => {
    if (!signalement) return;
    setLoadingData(true);
    try {
      const [preuvesRes, membersRes] = await Promise.all([
        preuveService.getBySignalement(signalement._id),
        signalementMemberService.getBySignalement(signalement._id)
      ]);
      setPreuves(preuvesRes.data);
      console.log("preuves", preuvesRes.data)
      setMembers(membersRes.data || []);
    } catch (e) {
      console.error('Failed to load related data', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateStatus = async (newStatus: StatutSignalement) => {
    if (!signalement) return;
    setUpdatingStatus(true);
    try {
      const updated = await signalementService.updateStatus(signalement._id, newStatus);
      onStatusChange(updated.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      alert("Erreur lors de la mise à jour du statut.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!signalement) return;
    setDeletingMember(memberId);
    try {
      await signalementMemberService.delete(memberId);
      // Recharger les membres après suppression
      const membersRes = await signalementMemberService.getBySignalement(signalement._id);
      setMembers(membersRes.data || []);
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
      alert("Erreur lors de la suppression du membre.");
    } finally {
      setDeletingMember(null);
    }
  };
  const handleDeletePreuve = async (preuveId: string) => {
    if (!signalement) return;
    setDeletingPreuve(preuveId);
    try {
      await preuveService.delete(preuveId);
      // Recharger les membres après suppression
      const preuvesRes = await preuveService.getBySignalement(signalement._id);
      setPreuves(preuvesRes.data || []);
    } catch (error) {
      console.error("Erreur lors de la suppression du membre", error);
      alert("Erreur lors de la suppression du membre.");
    } finally {
      setDeletingMember(null);
    }
  };

  if (!isOpen || !signalement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-gray-900/50 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{signalement.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(signalement.dateIncident).toLocaleDateString('fr-FR')}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium ml-2">{signalement.nature}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {readOnly && (
              <button
                onClick={handleEditClick}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-2 px-3"
                title="Éditer le signalement"
              >
                <Edit className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Éditer</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-indigo-50/50 px-6 py-3 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Statut actuel :</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-indigo-200 text-indigo-700 shadow-sm">
              {signalement.status.replace('_', ' ')}
            </span>
          </div>

          {!readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Mettre à jour :</span>
              <select
                value={signalement.status}
                disabled={updatingStatus}
                onChange={(e) => handleUpdateStatus(e.target.value as StatutSignalement)}
                className="text-sm border-gray-300 rounded-lg py-1.5 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 px-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Détails de l'incident
          </button>
          <button
            onClick={() => setActiveTab('membres')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'membres' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Membres impliqués ({members.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preuves')}
            className={`py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'preuves' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Preuves ({preuves.length})
            </div>
          </button>
        </div>


        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">

          {/* TAB: Détails */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Description de l'incident</h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {signalement.description}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Lieu</h4>
                    <p className="font-medium text-sm text-gray-900">{signalement.location}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Gravité</h4>
                    <p className="font-medium text-sm text-rose-600 uppercase">{signalement.gravite}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Type Violence</h4>
                    <p className="font-medium text-sm text-gray-900 capitalize">{signalement.typeViolence}</p>
                  </div>
                  {user && (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER) && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Signaleur
                      </h4>

                      {signalement.isAnonymous ? (
                        <p className="font-medium text-sm italic text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                          Anonyme
                        </p>
                      ) : signalement.reportedBy ? (
                        <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                          <p className="font-bold text-sm text-gray-900 leading-none">
                            {signalement.reportedBy.firstName} {signalement.reportedBy.lastName}
                          </p>
                          <p className="text-xs text-indigo-600 mt-1">{signalement.reportedBy.email}</p>
                          <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-white text-[10px] font-bold uppercase tracking-tight text-indigo-700 border border-indigo-100 shadow-sm">
                            {signalement.reportedBy.role}
                          </span>
                        </div>
                      ) : (
                        <p className="font-medium text-sm text-gray-400">Inconnu</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100">
                  <h3 className="text-sm font-bold text-indigo-900 mb-2">Informations Système</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-indigo-600/70 block text-xs font-medium">Créé le</span>
                      <span className="text-indigo-900 font-medium">{new Date(signalement.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                    <div>
                      <span className="text-indigo-600/70 block text-xs font-medium">Dernière mise à jour</span>
                      <span className="text-indigo-900 font-medium">{new Date(signalement.updatedAt).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: Membres */}
          {activeTab === 'membres' && (
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
              {loadingData ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                </div>
              ) : members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map(member => (
                    <div key={member._id} className="p-4 rounded-lg border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all bg-gray-50/50 relative group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{member.firstName} {member.lastName}</p>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase
                            ${member.role === RoleIncident.VICTIME ? 'bg-red-100 text-red-700' :
                              member.role === RoleIncident.AUTEUR_PRESUME ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'}`}>
                            {member.role === RoleIncident.VICTIME ? 'Victime' : member.role === RoleIncident.AUTEUR_PRESUME ? 'Agresseur' : 'Témoin'}
                          </span>
                        </div>

                        {readOnly && (
                          <button
                            onClick={() => handleDeleteMember(member._id)}
                            disabled={deletingMember === member._id}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-100 disabled:cursor-not-allowed"
                            title="Supprimer ce membre"
                          >
                            {deletingMember === member._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                  <p>Aucun membre associé à ce signalement.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Preuves */}
          {activeTab === 'preuves' && (
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
              {loadingData ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                </div>
              ) : preuves.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {preuves.map(preuve => {
                    const mediaUrl = getMediaUrl(preuve.fileUrl);
                    console.log("mediaUrl", mediaUrl)
                    return (
                      <div key={preuve._id} className="group relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">

                        {preuve.fileType === TypeEpreuve.IMAGE && (
                          <div className="aspect-video relative overflow-hidden bg-gray-200">

                            <img
                              src={mediaUrl}
                              alt="Preuve"
                              className="w-full h-full object-cover"
                            />

                            {/* bouton voir image */}
                            <a
                              href={mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute bottom-2 left-2 px-3 py-1 bg-white rounded-md text-xs font-medium text-gray-800"
                            >
                              Voir l'image
                            </a>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}

                          </div>
                        )}
                        {preuve.fileType === TypeEpreuve.OTHER && mediaUrl.endsWith('.pdf') && (
                          <div className="relative aspect-video overflow-hidden bg-gray-100 flex flex-col items-center justify-center">

                            {/* Preview PDF */}
                            <iframe
                              src={mediaUrl}
                              className="w-full h-full"
                              title="Document PDF"
                            ></iframe>

                            {/* Delete button */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}

                          </div>
                        )}

                        {preuve.fileType === TypeEpreuve.AUDIO && (
                          <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 p-4 relative">
                            <Headphones className="w-12 h-12 text-indigo-400 mb-4" />
                            <audio controls src={mediaUrl} className="w-full max-w-full" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                              <a href={mediaUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white shadow-sm hover:bg-gray-50 text-gray-700 border border-gray-200 rounded text-xs font-semibold">Ouvrir</a>
                            </div>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {preuve.fileType === TypeEpreuve.VIDEO && (
                          <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 p-4 relative">
                            <PlayCircle className="w-12 h-12 text-indigo-400 mb-4" />
                            <video controls src={mediaUrl} className="w-full max-w-full" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                              <a href={mediaUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white shadow-sm hover:bg-gray-50 text-gray-700 border border-gray-200 rounded text-xs font-semibold">Ouvrir</a>
                            </div>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 left-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {(!preuve.fileType || preuve.fileType === TypeEpreuve.DOCUMENT) && (
                          <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 p-4 relative">
                            <FileText className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-xs font-medium text-gray-600 px-2 py-1 bg-white rounded uppercase shadow-sm border border-gray-100 mt-2">Document</span>
                            <a href={mediaUrl} target="_blank" rel="noreferrer" className="mt-4 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 z-10 pointer-events-auto">
                              Voir le fichier
                            </a>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {preuve.fileType === TypeEpreuve.OTHER && mediaUrl.endsWith('.pdf') && (
                          <div className="relative aspect-video overflow-hidden bg-gray-100 flex flex-col items-center justify-center">

                            {/* Preview PDF complète */}
                            <iframe
                              src={mediaUrl}
                              className="w-full h-full"
                              title="Document PDF"
                            ></iframe>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}

                          </div>
                        )}

                        {preuve.fileType === TypeEpreuve.OTHER && !mediaUrl.endsWith('.pdf') && (
                          <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 p-4 relative">
                            <FileText className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-xs font-medium text-gray-600 px-2 py-1 bg-white rounded uppercase shadow-sm border border-gray-100 mt-2">Autre</span>
                            <a href={mediaUrl} target="_blank" rel="noreferrer" className="mt-4 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 z-10 pointer-events-auto">
                              Voir le fichier
                            </a>

                            {/* bouton suppression */}
                            {readOnly && (
                              <button
                                onClick={() => handleDeletePreuve(preuve._id)}
                                disabled={deletingPreuve === preuve._id}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50 z-20"
                                title="Supprimer"
                              >
                                {deletingPreuve === preuve._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
                          <span>Soumis le</span>
                          <span className="font-medium text-gray-700">{new Date(preuve.uploadedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <Paperclip className="w-12 h-12 text-gray-300 mb-3" />
                  <p>Aucune preuve matérielle fournie.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
