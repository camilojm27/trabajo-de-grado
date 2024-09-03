import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Activity, ChevronLeft, ChevronRight, Copy, MoreVertical} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination";
import {Node} from "@/types/node";
import React, {useMemo} from "react";
import {NodeAddUsers} from "@/Pages/Nodes/NodeAddUsers";
import {Link} from "@inertiajs/react";

interface NodesProps {
    node: Node
}

export function NodeDetailLateral({node}: NodesProps) {
    if (!node) {
        return null;
    }
    console.log(node);
    const parsedAttributes = useMemo(() => {
        try {
            return JSON.parse(node.attributes as unknown as string);
        } catch (error) {
            console.error("Error parsing node attributes:", error);
            return {
                hardware: {},
                os: {},
                software: {}
            };
        }
    }, [node.attributes]);
    return (
        <Card
            className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
        >
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                        Node {node.id}
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Copy className="h-3 w-3"/>
                            <span className="sr-only">Copy Node ID</span>
                        </Button>
                    </CardTitle>
                    <CardDescription>Created: {new Date(node.created_at).toLocaleDateString()}</CardDescription>
                    <div className="ml-auto flex items-center gap-1">
                        <Button variant="link">
                            <Link className="w-full inline-flex" href={`/containers/${node.id}`}>
                                <Activity className="h-4 w-4"/> Node Containers </Link>
                        </Button>
                        <Button variant="link">
                            <Link className="w-full inline-flex" href={`/nodes/show/${node.id}`}>
                                <Activity className="h-4 w-4"/> Realtime Stats</Link>
                        </Button>
                        <NodeAddUsers node={node}></NodeAddUsers>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="h-8 w-8">
                                    <MoreVertical className="h-3.5 w-3.5"/>
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Node Details</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span>{node.name}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Hostname</span>
                            <span>{node.hostname}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">IP Address</span>
                            <span>{node.ip_address}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span>{node.isOnline ? 'Online' : 'Offline'}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div className="grid gap-3">
                    <div className="font-semibold">Hardware Information</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">CPU</span>
                            <span>{parsedAttributes.hardware.cpu}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Cores</span>
                            <span>{parsedAttributes.hardware.cores}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Threads</span>
                            <span>{parsedAttributes.hardware.threats}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Clock Speed</span>
                            <span>{parsedAttributes.hardware.mhz}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">RAM</span>
                            <span>{parsedAttributes.hardware.ram}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Swap</span>
                            <span>{parsedAttributes.hardware.swap}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Disk</span>
                            <span>{parsedAttributes.hardware.disk}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Available Disk</span>
                            <span>{parsedAttributes.hardware.disk_available}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">GPU</span>
                            <span>{parsedAttributes.hardware.gpu}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div className="grid gap-3">
                    <div className="font-semibold">OS Information</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">System</span>
                            <span>{parsedAttributes.os.system}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Kernel</span>
                            <span>{parsedAttributes.os.kernel}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span>{parsedAttributes.os.name}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Full Name</span>
                            <span>{parsedAttributes.os.fullname}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Based On</span>
                            <span>{parsedAttributes.os.based_on}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Architecture</span>
                            <span>{parsedAttributes.os.arch}</span>
                        </li>
                    </ul>
                </div>
                <Separator className="my-4"/>
                <div className="grid gap-3">
                    <div className="font-semibold">Software Information</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Python</span>
                            <span>{parsedAttributes.software.python}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Docker</span>
                            <span>{parsedAttributes.software.docker}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">PHP</span>
                            <span>{parsedAttributes.software.php.substring(0, 55)}...</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Composer</span>
                            <span>{parsedAttributes.software.composer}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Node.js</span>
                            <span>{parsedAttributes.software.nodejs}</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">NPM</span>
                            <span>{parsedAttributes.software.npm}</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    Updated <time dateTime={node.updated_at}>{new Date(node.updated_at).toLocaleString()}</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronLeft className="h-3.5 w-3.5"/>
                                <span className="sr-only">Previous Node</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button size="icon" variant="outline" className="h-6 w-6">
                                <ChevronRight className="h-3.5 w-3.5"/>
                                <span className="sr-only">Next Node</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    )
}
