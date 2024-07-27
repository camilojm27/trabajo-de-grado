import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {User} from "@/types";
import {SVGProps, useEffect, useRef, useState} from "react";
import {Link} from "@inertiajs/react";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {JSX} from "react/jsx-runtime";
import {Badge} from "@/components/ui/badge";
import ContainerMetrics from "@/components/app/ContainerMetrics";
import ContainerLogs from "@/components/app/ContainerLogs";

interface Metrics {
    mem_limit: number;
    mem_free: number;
    cpu_percent: number;
    net_input: number;
    net_output: number;
}

interface Props {
    auth: {
        user: User;
    };
    container: any;
}

export default function Show({auth, container}: Props) {
    console.log(container.container_id);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<div className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                <Link
                    className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
                    href="#">
                    <ServerIcon className="w-6 h-6"/>
                    <span className="sr-only">Server Dashboard</span>
                </Link>
                <nav
                    className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
                    <Link className="font-bold" href="#">
                        Server Details
                    </Link>
                    {/*<Link className="text-gray-500 dark:text-gray-400" href={`/containers/${node.id}`}>*/}
                    {/*    Containers*/}
                    {/*</Link>*/}
                    <Link className="text-gray-500 dark:text-gray-400" href="#">
                        Settings
                    </Link>
                </nav>
            </div>
            }
        >
            <div className="flex flex-col w-full min-h-screen bg-white">

                <main
                    className="flex min-h-[calc(100vh-_theme(spacing.16))]  flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-900">
                    <div className="max-w-6xl w-full mx-auto grid gap-2">
                        <h1 className="font-semibold text-3xl">Server Details</h1>
                        <div className="flex items-center text-sm gap-2">
                            <a className="font-medium" href="#" target="_blank">
                                {container.container_id}
                            </a>
                            <Separator className="h-5" orientation="vertical"/>
                            {container.node.isOnline ? (
                                <Badge className="bg-green-200 text-green-800" variant="outline">
                                    Online
                                </Badge>) : (
                                <Badge className="bg-red-200 text-red-800" variant="outline">
                                    Offline
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-6 max-w-6xl w-full mx-auto">

                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Container Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm p-6">
                                <div className="flex items-center">
                                    <div>Name</div>
                                    <div className="font-semibold ml-auto">{container.name}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Platform ID</div>
                                    <div className="font-semibold ml-auto">{container.id}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Host ID</div>
                                    <div className="font-semibold ml-auto">{container.container_id}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Image</div>
                                    <div className="font-semibold ml-auto">{container.image}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Command</div>
                                    <div className="font-semibold ml-auto">{container.attributes.Command}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>State</div>
                                    <div className="font-semibold ml-auto">{container.state}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Status</div>
                                    <div className="font-semibold ml-auto">{container.status}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Creado en:</div>
                                    <div className="font-semibold ml-auto">{container.created}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Registrado en:</div>
                                    <div className="font-semibold ml-auto">{container.created_at}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Ultima Actualización Registrada en:</div>
                                    <div className="font-semibold ml-auto">{container.updated_at}</div>
                                </div>
                                {container.error && (
                                    <div className="flex items-center bg-red-600">
                                        <div>Error</div>
                                        <div className="font-semibold ml-auto">{container.error}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-6 max-w-6xl w-full mx-auto lg:grid-cols-2">

                        <ContainerMetrics container={container} />
                        <ContainerLogs container={container} />

                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Operating System Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm p-6">
                                <pre>{JSON.stringify(container, null, 4)}</pre>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}


function ServerIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
            <line x1="6" x2="6.01" y1="6" y2="6"/>
            <line x1="6" x2="6.01" y1="18" y2="18"/>
        </svg>)
    );
}
