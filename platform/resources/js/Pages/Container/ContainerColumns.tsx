import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Container} from "@/types/container";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Link, router} from "@inertiajs/react";


export const ContainerColumns: ColumnDef<Container>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
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
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4"/> :
                        <ArrowDown className="ml-2 h-4 w-4"></ArrowDown>}                </Button>
            )
        },
        cell: ({row}) => (
            <div>
                <div>{row.original.name}</div>
                <div>{row.original.container_id?.slice(0, 12)}</div>
            </div>
        ),
    },
    {
        accessorKey: "image",
        header: ({column}) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Image
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>

            )
        },
        cell: ({row}) => <div className="lowercase">{row.getValue("image")}</div>,
    },
    {
        accessorKey: "state",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    State
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => <div className="lowercase">{row.getValue("state")}</div>,

    },
    {
        accessorKey: "Registered at",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Registered at
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => (
            <div>
                {
                    (() => {
                        const date = new Date(row.original.created_at);
                        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                    })()
                }
            </div>
        ),


    },
    {
        accessorKey: "Created At",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4"/>

                </Button>
            )
        },
        cell: ({row}) => (
            <div>
                {
                    (() => {
                        const date = new Date(row.original.created);
                        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                    })()
                }
            </div>
        ),


    },
    {
        accessorKey: "Ports",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ports
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>)
        },
        cell: ({row}) => <Collapsible className="lowercase">{
            //console.log(row.original.attributes)
            row.original.attributes.Ports?.map((port, index) => (
                // if (index === 0) return <div key={port.PrivatePort} className="capitalize">Ports:</div>
                <div key={index}>
                    {index < 1 ? (
                        <CollapsibleTrigger>{port.PrivatePort}:{port.PublicPort}/{port.Type}</CollapsibleTrigger>
                    ) : (
                        <CollapsibleContent>
                            {port.PrivatePort}:{port.PublicPort}/{port.Type}
                        </CollapsibleContent>
                    )}
                </div>
            ))


        }</Collapsible>,
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const container = row.original;
            const isItemDisabled = (menuItem: string) => {
                switch (menuItem) {
                    case "restart":
                        return !(container.state == "paused" || container.state == "running");
                    case "create":
                        return !(container.state == "send" || container.state == "error");
                    case "start":
                        return !(container.state == "created" || container.state == "send" || container.state == "exited")
                    case "stop":
                        return !(container.state == "running" || container.state == "paused" || container.state == "restarting");
                    case "kill":
                        return !(container.state == "created" || container.state == "error" || container.state == "exited");
                    case "pause":
                        return !(container.state == "running");
                    case "unpause":
                        return !(container.state == "paused");
                    case "delete":
                        return false
                    default:
                        return false;
                }
            };
            //TODO: Add Icons to actions
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(container.container_id)}
                        >
                            Copy Container ID (Node)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(container.id))}
                        >
                            Copy payment ID
                            Copy Container ID (Platform)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <Link href={"/containers/show/" + container.id}>
                            <DropdownMenuItem className="cursor-pointer">
                                View Container
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem disabled={isItemDisabled("restart")}>Restart Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("recreate")} onClick={
                            () => {
                                router.post("/containers/recreate/" + container.id);
                            }
                        }>Recreate Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("start")}
                                          onClick={() => {
                                              router.post("/containers/start/" + container.id);
                                          }}
                        >Start Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("stop")}>Stop Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("kill")}>Kill Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("delete")}>Delete Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("pause")}>Pause Container</DropdownMenuItem>
                        <DropdownMenuItem disabled={isItemDisabled("unpause")}>Unpause Container</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <Link href={"/nodes/" + container.node_id}>
                            <DropdownMenuItem className="cursor-pointer">
                                View Node
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>

                </DropdownMenu>
            )
        },
    },
]
