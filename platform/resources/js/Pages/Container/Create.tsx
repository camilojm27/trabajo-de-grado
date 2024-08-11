import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CreateContainerForm } from './create/CreateContainerForm';
import { User } from '@/types';
import { Node } from '@/types/node';
//import { ContainerTemplate } from '@/types/containerTemplate';

interface CreateContainerPageProps {
    auth: {
        user: User;
    };
    nodes: Node[];
    templates: any[];
}

export default function CreateContainerPage({ auth, nodes, templates }: CreateContainerPageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Link href="/containers">
                    <Button variant="outline">Container List</Button>
                </Link>
            }
        >
            <Head title="Create Container" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <CreateContainerForm nodes={nodes} templates={templates} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
