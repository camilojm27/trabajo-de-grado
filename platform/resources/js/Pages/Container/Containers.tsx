import React, { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button.jsx";
import { Container } from "@/types/container";
import { PaginationI, User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContainersTable from "@/Pages/Container/ContainersTable";

interface ContainersProps {
    auth: {
        user: User;
    };
    containers: PaginationI<Container>;
}

export default function Containers({ auth, containers }: ContainersProps) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState("my-nodes");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl && ["system-containers", "all-containers", "my-containers"].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        } else{
            setActiveTab("my-containers");
        }
    }, []);

    useEffect(() => {
        // @ts-ignore
        const channel = window.Echo.channel('containers');

        channel.listen('ContainerProcessed', (event: any) => {
            console.log('Container processed:', event);
            router.reload()
        });

        return () => {
            channel.stopListening('ContainerProcessed');
        };
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.get(url.split('?')[0], { tab: value }, { preserveState: true, replace: true });
    };

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
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <div className="flex items-center">
                            <TabsList>
                                {auth.user.is_admin && <TabsTrigger value="system-containers">System Containers</TabsTrigger>}                                <TabsTrigger value="all-containers">All Containers</TabsTrigger>
                                <TabsTrigger value="my-containers">My Containers</TabsTrigger>
                            </TabsList>

                            {/* Filters */}
                            <div className="ml-auto flex items-center gap-2">
                                {/* ... (DropdownMenu and Export button remain unchanged) ... */}
                            </div>
                        </div>
                        <TabsContent value="system-containers">
                            <Card>
                                <CardHeader className="px-7">
                                    <CardTitle>System Nodes</CardTitle>
                                    <CardDescription>
                                        View all system nodes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContainersTable containers={containers} callback={(e) => console.log(e)} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="all-containers">
                            <Card>
                                <CardHeader className="px-7">
                                    <CardTitle>All Nodes</CardTitle>
                                    <CardDescription>
                                        View all user nodes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContainersTable containers={containers} callback={(e) => console.log(e)} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="my-containers">
                            <Card>
                                <CardHeader className="px-7">
                                    <CardTitle>My Nodes</CardTitle>
                                    <CardDescription>
                                        View your personal nodes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContainersTable containers={containers} callback={(e) => console.log(e)} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
