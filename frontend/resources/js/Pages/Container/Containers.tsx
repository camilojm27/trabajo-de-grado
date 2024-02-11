import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "@inertiajs/react";
import {Container} from "@/types/container";
import {User} from "@/types";
import DataTable from "@/components/app/DataTable";
import {ContainerColumns} from "@/Pages/Container/ContainerColumns";
interface ContainersProps {
    auth: {
        user: User;
    };
    containers: Container[];
}



export default function Containers({auth, containers}: ContainersProps) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Link href="/containers/create">
                <Button>Crear Contenedor</Button>
            </Link>}
        >
            <main className="p-4 md:p-6">

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">Containers Status</h1>
                    <div className="flex justify-center items-center bg-gray-100">
                        <DataTable columns={ContainerColumns} data={containers}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
