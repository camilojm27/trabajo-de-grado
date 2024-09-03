import {Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


import {ReactNode} from 'react';

export default function Settings({auth, children}: { auth: any, children: ReactNode }) {
    const isRouteActive = (routeName: string) => {
        return route().current(routeName);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <main
                className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-7xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div
                    className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav
                        className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                    >
                        <Link href="/profile" className={` ${isRouteActive('profile.edit') ? 'font-semibold text-primary' : ''}`}>
                            Profile
                        </Link>
                        <Link href="/settings/general" className={` ${isRouteActive('settings.general') ? 'font-semibold text-primary' : ''}`}>General</Link>
                        <Link href="/settings/phpinfo" className={` ${isRouteActive('settings.phpinfo') ? 'font-semibold text-primary' : ''}`}>PHP Info</Link>
                        {/*<Link href="#">Server</Link>*/}
                        {/*<Link href="#">Advanced</Link>*/}
                    </nav>
                    <div className="grid gap-6">
                        {children}
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    )
}

