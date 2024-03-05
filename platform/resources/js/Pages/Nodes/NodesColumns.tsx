import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, ArrowUp, ArrowDown} from "lucide-react";
import {Node} from "@/types/node";


export const NodesColumns: ColumnDef<Node>[] = [
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
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    ID
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                <div>{row.original.id}</div>
            </div>
        ),
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
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        id: "Name",

        cell: ({ row }) => (
            <div>
                <div>{row.original.name}</div>
            </div>
        ),
    },

    {
        accessorKey: "hostname",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Hostname
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.original.hostname}</div>
        ),
    },
    {
        accessorKey: "attributes.hardware.cpu",
        id: "CPU",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    CPU
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.hardware.cpu}</div>,
    },
    {
        accessorKey: "attributes.hardware.cores",
        id: "Cores",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Cores
                    {column.getIsSorted() === "asc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>{row.original.attributes.hardware.cores.toString()}</div>
        ),
    },
    {
        accessorKey: "attributes.hardware.threats",
        id: "Threats",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Threats
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>{row.original.attributes.hardware.threats}</div>
        ),
    },
    {
        accessorKey: "attributes.hardware.disk",
        id: "Disk",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Disk
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.hardware.disk}</div>,
    },
    {
        accessorKey: "attributes.hardware.disk_available",
        id: "Disk Available",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Disk Avialable
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>{row.original.attributes.hardware.disk_available}</div>
        ),
    },
    {
        accessorKey: "attributes.hardware.gpu",
        id: "GPU",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    GPU
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.hardware.gpu}</div>,
    },
    {
        accessorKey: "attributes.hardware.ram",
        id: "RAM",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    RAM
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.hardware.ram}</div>,
    },
    {
        accessorKey: "attributes.hardware.swap",
        id: "SWAP",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    SWAP
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.hardware.swap}</div>,
    },
    {
        accessorKey: "attributes.os.kernel",
        id: "Kernel",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Kernel
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.os.kernel}</div>,
    },
    {
        accessorKey: "attributes.os.fullname",
        id: "Distribution",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Distribution
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.os.fullname}</div>,
    },
    {
        accessorKey: "attributes.os.based_on",
        id: "Based On",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Based On
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.os.based_on}</div>,
    },
    {
        accessorKey: "attributes.os.arch",
        id: "Arch",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Architecture
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                {row.original.attributes.os.arch[0]}{" "}
                {row.original.attributes.os.arch[1]}
            </div>
        ),
    },
    {
        accessorKey: "attributes.software.docker",
        id: "Docker",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Docker
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}{" "}
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.attributes.software.docker}</div>,
    },
];
