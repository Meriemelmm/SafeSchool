import React from 'react';
// import { SignalementStats } from './SignalementStats';
import { SignalementPageClient } from './SignalementPageClient';
import { ISignalement } from 'shared/interfaces/signalement.interface';

type SignalementViewProps = {
    initialData: ISignalement[];
    totalItems: number;
    title: string;
    description: string;
};

/**
 * Main Signalement view used across dashboards.
 * Since it contains SignalementStats (Server Component) and SignalementPageClient (Client Component), 
 * it leverages Next.js mixed component architecture for better performance.
 */
export default function SignalementView({
    initialData,
    totalItems,
    title,
    description,
}: SignalementViewProps) {
    return (
        <section className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto py-8">
                {/* Pass individual data to SignalementPageClient which manages the list, search and modal logic */}
                <SignalementPageClient
                    initialData={initialData}
                    title={title}
                    description={description}
                >
                    {/* <SignalementStats signalements={[]} /> */}
                </SignalementPageClient>
            </div>
        </section>
    );
}
