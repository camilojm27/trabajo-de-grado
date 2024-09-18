import React, { useState } from 'react';
import { Node } from "@/types/node";
import { Container } from "@/types/container";
import { PaginationI } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import LaraPagination from "@/components/app/LaraPagination";
import ContainerActions from "@/Pages/Container/ContainerActions";

interface ContainersProps {
    containers: PaginationI<Container>,
    callback: (nodeId: string) => void
}

type SortField = 'name' | 'image' | 'state' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function ContainersTable({ containers, callback }: ContainersProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const handleNodeClick = (node: Node) => {
        setSelectedNodeId(node.id);
        callback(node.id);
    };

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedContainers = [...containers.data].sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'image':
                aValue = a.image.toLowerCase();
                bValue = b.image.toLowerCase();
                break;
            case 'state':
                aValue = a.state.toLowerCase();
                bValue = b.state.toLowerCase();
                break;
            case 'created_at':
                aValue = new Date(a.created_at).getTime();
                bValue = new Date(b.created_at).getTime();
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ field }: { field: SortField }) => {
        if (field !== sortField) return null;
        return sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline"/> :
            <ChevronDownIcon className="w-4 h-4 inline"/>;
    };

    function renderVariant(value: string) {
        switch (value) {
            case 'running':
                return 'default'
            case 'paused':
                return 'outline'
            default:
                return "secondary"
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString();
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                        Container <small>(Name - ID)</small> <SortIcon field="name"/>
                    </TableHead>
                    <TableHead onClick={() => handleSort('image')} className="hidden sm:table-cell cursor-pointer">
                        Image <SortIcon field="image"/>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Status
                    </TableHead>
                    <TableHead onClick={() => handleSort('state')} className="hidden md:table-cell cursor-pointer">
                        State <SortIcon field="state"/>
                    </TableHead>
                    <TableHead onClick={() => handleSort('created_at')} className="text-right cursor-pointer">
                        Registered at <SortIcon field="created_at"/>
                    </TableHead>
                    <TableHead className="text-right">
                        Created At
                    </TableHead>
                    <TableHead>
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedContainers.map((container) => (
                    <TableRow
                        key={container.id}
                        className={container.created === null ? "dark:bg-red-950 bg-red-400  " : ""}
                    >
                        <TableCell>
                            <div className="font-medium">{container.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {container.container_id}
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {container.image}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                                {container.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Badge className="text-xs" variant={renderVariant(container.state)}>
                                {container.state}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {formatDate(container.created_at)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {container.created !== null ? formatDate(container.created) : ""}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <ContainerActions container={container}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <LaraPagination paginationObject={containers}/>
        </Table>
    );
}
