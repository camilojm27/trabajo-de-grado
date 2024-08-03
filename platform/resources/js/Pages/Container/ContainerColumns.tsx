import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";
import {Container} from "@/types/container";
import {Link, router} from "@inertiajs/react";
import {
    EyeOpenIcon,
    HobbyKnifeIcon,
    PauseIcon,
    PlayIcon,
    ReloadIcon,
    ResetIcon,
    ResumeIcon,
    StopIcon,
    TrashIcon
} from '@radix-ui/react-icons'
import React from "react";
import {useToast} from "@/components/ui/use-toast";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

// @ts-ignore
export const ContainerColumns: ColumnDef<Container>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4"></ArrowDown>
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                <div>{row.original.name}</div>
                <div>{row.original.container_id?.slice(0, 12)}</div>
            </div>
        ),
    },
    {
        accessorKey: "image",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Image
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => ( // @ts-ignore
            <div className="lowercase">{row.getValue("image").substring(0,40)}...</div>
        ),
    },
    {
        accessorKey: "state",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    State
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("state")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "Registered at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Registered at
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                {(() => {
                    const date = new Date(row.original.created_at);
                    return (
                        date.toLocaleDateString() +
                        " " +
                        date.toLocaleTimeString()
                    );
                })()}
            </div>
        ),
    },
    {
        accessorKey: "created",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                {row.getValue("created")}
            </div>
        ),
    },
    // {
    //     accessorKey: "Ports",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() =>
    //                     column.toggleSorting(column.getIsSorted() === "asc")
    //                 }
    //             >
    //                 Ports
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <Collapsible className="lowercase">
    //             {
    //                 //console.log(row.original.attributes)
    //                 row.original.attributes.Ports?.map((port, index) => (
    //                     // if (index === 0) return <div key={port.PrivatePort} className="capitalize">Ports:</div>
    //                     <div key={index}>
    //                         {index < 1 ? (
    //                             <CollapsibleTrigger>
    //                                 {port.PrivatePort}:{port.PublicPort}/
    //                                 {port.Type}
    //                             </CollapsibleTrigger>
    //                         ) : (
    //                             <CollapsibleContent>
    //                                 {port.PrivatePort}:{port.PublicPort}/
    //                                 {port.Type}
    //                             </CollapsibleContent>
    //                         )}
    //                     </div>
    //                 ))
    //             }
    //         </Collapsible>
    //     ),
    // },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const { toast } = useToast();
            const container = row.original;
            const isItemDisabled = (menuItem: string) => {
                switch (menuItem) {
                    // case "restart":
                    //     return !(container.state == "paused" || container.state == "running");
                    // case "recreate":
                    //     //TODO: Make sure we can recreate all containers
                    //     return !(container.state == "send" || container.state == "error");
                    // case "start":
                    //     return !(container.state == "created" || container.state == "exited")
                    // case "stop":
                    //     return !(container.state == "running" || container.state == "paused" || container.state == "restarting");
                    // case "kill":
                    //     return !(container.state == "created" || container.state == "error");
                    // case "pause":
                    //     return !(container.state == "running");
                    // case "unpause":
                    //     return !(container.state == "paused");
                    // case "delete":
                    //     return false
                    default:
                        return false;
                }
            };

            const sendOrderToContainer = (order: string) => () => {
                router.post(
                    `/containers/${order}/${container.id}`,
                    {},
                    {
                        onSuccess: () => {
                            toast({
                                title: `${order} sent`,
                                description: <span className="text-white"></span>,
                            });
                        },
                        onError: () => {
                            toast({
                                title: "Container send",
                                variant: "destructive",
                                description: (
                                    <span className="text-white">
                  Error sending {order} order to container.
                  Verify the RabbitMQ server is running.
                </span>
                                ),
                            });
                        },
                    }
                );
            };

            // @ts-ignore
            const ActionButton = ({ action, icon, tooltip }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={isItemDisabled(action)}
                                onClick={sendOrderToContainer(action)}
                            >
                                {icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );

            return (
                <div className="flex flex-wrap gap-2">
                    {/*<Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(container.container_id)}>*/}
                    {/*    Copy Node ID*/}
                    {/*</Button>*/}
                    {/*<Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(String(container.id))}>*/}
                    {/*    Copy Platform ID*/}
                    {/*</Button>*/}
                    <Link href={`/containers/show/${container.id}`}>
                        <Button variant="outline" size="sm">
                            <EyeOpenIcon className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </Link>
                    <ActionButton action="restart" icon={<ReloadIcon className="h-4 w-4" />} tooltip="Restart Container" />
                    <ActionButton action="recreate" icon={<ResetIcon className="h-4 w-4" />} tooltip="Recreate Container" />
                    <ActionButton action="start" icon={<PlayIcon className="h-4 w-4" />} tooltip="Start Container" />
                    <ActionButton action="stop" icon={<StopIcon className="h-4 w-4" />} tooltip="Stop Container" />
                    <ActionButton action="kill" icon={<HobbyKnifeIcon className="h-4 w-4" />} tooltip="Kill Container" />
                    <ActionButton action="delete" icon={<TrashIcon className="h-4 w-4" />} tooltip="Delete Container" />
                    <ActionButton action="pause" icon={<PauseIcon className="h-4 w-4" />} tooltip="Pause Container" />
                    <ActionButton action="unpause" icon={<ResumeIcon className="h-4 w-4" />} tooltip="Unpause Container" />
                    <Link href={`/nodes/${container.node_id}`}>
                        <Button variant="outline" size="sm">
                            View Node
                        </Button>
                    </Link>
                </div>
            );
        }}
];
