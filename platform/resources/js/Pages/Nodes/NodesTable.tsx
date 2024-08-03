import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Node } from "@/types/node";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface NodesProps {
    nodes: Node[]
    callback: (nodeId: string) => void
}

type SortField = 'owner' | 'hostname' | 'id' | 'ip_address';
type SortOrder = 'asc' | 'desc';

export default function NodesTable({ nodes, callback }: NodesProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('owner');
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

    const sortedNodes = [...nodes].sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
            case 'owner':
                aValue = a.creator?.name?.toLowerCase() ?? '';
                bValue = b.creator?.name?.toLowerCase() ?? '';
                break;
            case 'hostname':
                aValue = a.hostname.toLowerCase();
                bValue = b.hostname.toLowerCase();
                break;
            case 'id':
                aValue = a.id;
                bValue = b.id;
                break;
            case 'ip_address':
                aValue = a.ip_address;
                bValue = b.ip_address;
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
        return sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline" /> : <ChevronDownIcon className="w-4 h-4 inline" />;
    };

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => handleSort('owner')} className="cursor-pointer">
                        Owner <SortIcon field="owner" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('hostname')} className="hidden sm:table-cell cursor-pointer">
                        Hostname <SortIcon field="hostname" />
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Status
                    </TableHead>
                    <TableHead onClick={() => handleSort('id')} className="hidden md:table-cell cursor-pointer">
                        Node ID <SortIcon field="id" />
                    </TableHead>
                    <TableHead onClick={() => handleSort('ip_address')} className="text-right cursor-pointer">
                        IP <SortIcon field="ip_address" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedNodes.map((node) => (
                    <TableRow
                        key={node.id}
                        className={node.id === selectedNodeId ? "bg-accent cursor-pointer" : "cursor-pointer"}
                        onClick={() => handleNodeClick(node)}
                    >
                        <TableCell>
                            <div className="font-medium">{node.creator?.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {node.creator?.email}
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {node.hostname}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                                {node.isOnline ? "Online" : "Offline"}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {node.id}
                        </TableCell>
                        <TableCell className="text-right">{node.ip_address}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
