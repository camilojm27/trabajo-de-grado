import React, {FC} from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import {Button} from '@/components/ui/button';
import {File, ListFilter} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Node} from "@/types/node"

// @ts-ignore
type Tab = {
    value: string;
    label: string;
    cardTitle: string;
    cardDescription: string;
    component: FC<any>;
    data: Node[];
};

type GenericTabsProps = {
    tabs: Tab[];
    filters: string[];
    handleNodeSelect: (node: any) => void;
};

export default function GenericTabs({tabs, filters, handleNodeSelect}: GenericTabsProps) {
    return (
        <Tabs defaultValue={tabs[0].value}>
            <div className="flex items-center">
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Filters */}
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
                            {filters.map((filter) => (
                                <DropdownMenuCheckboxItem key={filter} checked>
                                    {filter}
                                </DropdownMenuCheckboxItem>
                            ))}
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

            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    <Card>
                        <CardHeader className="px-7">
                            <CardTitle>{tab.cardTitle}</CardTitle>
                            <CardDescription>{tab.cardDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Render the component passed in the tab config */}
                            <tab.component data={tab.data} callback={handleNodeSelect}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
};

