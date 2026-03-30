
import { signalementService } from '@/lib/services/signalement';
import SignalementView from '@/components/signalement/SignalementView';
import { ISignalement } from 'shared/interfaces/signalement.interface';

export const metadata = {
    title: 'Mes signalements | SafeSchool Parent',
    description: 'Suivi de vos signalements depuis votre espace parent.',
};

export default async function ParentSignalementsPage() {
    let initialSignalements: ISignalement[] = [];
    let totalItems = 0;

    try {
        const response = await signalementService.getMyReports(1, 10);
        if (response && response.data) {
            initialSignalements = response.data;
            totalItems = response.meta?.total || 0;
        }
    } catch (error) {
        console.error('Impossible de recuperer les signalements du parent :', error);
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <SignalementView
                initialData={initialSignalements}
                totalItems={totalItems}
                title="Mes signalements"
                description="Suivi et gestion des signalements que vous avez créés depuis votre espace parent."
            />
        </main>
    );
}
