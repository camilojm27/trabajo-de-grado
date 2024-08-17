import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Button} from "@/components/ui/button.jsx";
import {Link, router, usePage} from "@inertiajs/react";
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

export default function Containers({auth}: ContainersProps) {
    const {containers} = usePage().props;

    useEffect(() => {
        // @ts-ignore
        const channel = window.Echo.channel('containers');

        channel.listen('ContainerProcessed', (event: any) => {
            console.log('Container processed:', event);
            router.visit("/containers", {only: ['containers'], preserveScroll: true});
        });

        return () => {
            channel.stopListening('ContainerProcessed');
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Link href="/containers/create">
                <Button>Crear Contenedor</Button>
            </Link>}
        >
            <main className="p-6 md:p-6 ">
                <Button variant="default">
                    <Link className="w-full" href="/containers/create">Create Container</Link>
                </Button>
                <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">Containers Status</h1>
                <div className="flex justify-center items-center">
                    {/*// @ts-ignore*/}
                    <DataTable columns={ContainerColumns} data={containers}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
