import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button.jsx";
import {Link, router} from "@inertiajs/react";
import {Container} from "@/types/container";
import {User} from "@/types";
import DataTable from "@/components/app/DataTable";
import {ContainerColumns} from "@/Pages/Container/ContainerColumns";
import {useEffect} from "react";

interface ContainersProps {
    auth: {
        user: User;
    };
    containers: Container[];
}


export default function Containers({auth, containers}: ContainersProps) {
    useEffect(() => {
// @ts-ignore
        window.Echo.channel('containers')
            .listen('ContainerProcessed', () => {
                console.log("evento recibido");
                router.reload();
            });
        console.log("Effect");

    }, []);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Link href="/containers/create">
                <Button>Crear Contenedor</Button>
            </Link>}
        >
            <main className="p-6 md:p-6 max-w-7xl mx-auto">

                    <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">Containers Status</h1>
                    <div className="flex justify-center items-center">
                        <DataTable columns={ContainerColumns} data={containers}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    </div>
            </main>
        </AuthenticatedLayout>
    );
}
