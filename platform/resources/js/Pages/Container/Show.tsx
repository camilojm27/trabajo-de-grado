
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { User } from "@/types";
import { Container } from '@/types/container'

interface Props {
    auth: {
        user: User;
    };
    container: any;
}

export default function Show({ auth, container }: Props) {
    console.log(container);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                    <h2 className="text-lg font-semibold">Container</h2>
                </div>
            }>
            <main>
                <div className="flex flex-col w-full min-h-screen ">
                    <pre>{JSON.stringify(container, null, 4)}</pre>
                </div>
            </main>

        </AuthenticatedLayout>
    );
}
