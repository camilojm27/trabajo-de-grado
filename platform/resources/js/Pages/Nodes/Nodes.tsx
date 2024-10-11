import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {router, usePage} from '@inertiajs/react'
import {User} from "@/types";
import {Node} from "@/types/node"
import {File, ListFilter, Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import NodesTable from "@/Pages/Nodes/NodesTable";
import {NodeDetailLateral} from "@/Pages/Nodes/NodeDetailLateral";
import {NodeStats} from "@/Pages/Nodes/NodeStats";
import {Input} from "@/components/ui/input";

interface NodesProps {
    auth: {
        user: User
    }
    systemNodes: Node[]
    allUserNodes: Node[]
    myNodes: Node[]
    selectedNode: any
}

export default function Nodes({auth, allUserNodes, systemNodes, myNodes, selectedNode}: NodesProps) {

    const [currentNode, setCurrentNode] = useState(selectedNode);
    // @ts-ignore
    const {params: {id}} = usePage().props;

    useEffect(() => {
        if (id && !currentNode) {
            handleNodeSelect(id);
        }
    }, [id]);

    const handleNodeSelect = (nodeId: any) => {
        router.visit(`/nodes/${nodeId}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['selectedNode'],
        });
    };

    useEffect(() => {
        setCurrentNode(selectedNode);
    }, [selectedNode]);

    // const tabs = [
    //     {
    //         value: 'system-nodes',
    //         label: 'System Nodes',
    //         cardTitle: 'Orders',
    //         cardDescription: 'Recent orders from your store.',
    //         component: NodesTable, // Can be any component
    //         data: systemNodes
    //     },
    //     {
    //         value: 'all-nodes',
    //         label: 'All Nodes',
    //         cardTitle: 'Orders',
    //         cardDescription: 'Recent orders from your store.',
    //         component: NodesTable, // Use another component
    //         data: allUserNodes
    //     },
    //     {
    //         value: 'my-nodes',
    //         label: 'My Nodes',
    //         cardTitle: 'Orders',
    //         cardDescription: 'Recent orders from your store.',
    //         component: NodesTable, // Another different component
    //         data: myNodes
    //     }
    // // ];
    //
    // const filters = ['Fulfilled', 'Declined', 'Refunded'];

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

                    <NodeStats/>
                    <Card>
                        <CardHeader className="px-7">
                            <CardTitle>Nodes</CardTitle>
                            <CardDescription>
                                Type an container name, image or container id to search
                                <div className="relative ml-auto flex-1 md:grow-0 my-1">
                                    <Search
                                        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                    />
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="my-nodes">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="system-nodes">System Nodes</TabsTrigger>
                                        <TabsTrigger value="all-nodes">All Nodes</TabsTrigger>
                                        <TabsTrigger value="my-nodes">My Nodes</TabsTrigger>
                                    </TabsList>

                                    {/*Filters*/}

                                    <div className="ml-auto flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 gap-1 text-sm"
                                                >
                                                    <ListFilter className="h-3.5 w-3.5"/>
                                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuCheckboxItem checked>
                                                    Fulfilled
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem>
                                                    Declined
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem>
                                                    Refunded
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 gap-1 text-sm"
                                        >
                                            <File className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only">Export</span>
                                        </Button>
                                    </div>
                                </div>
                                <TabsContent value="system-nodes">
                                    <Card x-chunk="dashboard-05-chunk-3">

                                        <CardContent>
                                            <NodesTable nodes={systemNodes} callback={handleNodeSelect}/>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="all-nodes">
                                    <Card x-chunk="dashboard-05-chunk-3">
                                        <CardContent>
                                            <NodesTable nodes={allUserNodes} callback={handleNodeSelect}/>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="my-nodes">
                                    <Card x-chunk="dashboard-05-chunk-3">

                                        <CardContent>
                                            <NodesTable nodes={myNodes} callback={handleNodeSelect}/>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <NodeDetailLateral node={selectedNode}/>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
