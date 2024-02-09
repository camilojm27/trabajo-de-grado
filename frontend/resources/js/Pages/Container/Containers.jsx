import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import DataTable from "@/Components/app/DataTable.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "@inertiajs/react";

export default function Containers({auth, containers}) {
    console.log(containers)
    const listItems = containers.map(container =>
        <p key={container.name}>{container.name}</p>
    );
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Link href="/containers/create">
                <Button variant="outline">Crear Contenedor</Button>
            </Link>}
        >
            <main className="p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl md:text-2xl font-bold mb-4">Containers Status</h1>
                    <DataTable data={containers}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
