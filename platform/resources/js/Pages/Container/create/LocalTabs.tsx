import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

interface LocalTabsProps {
    children: React.ReactNode[];
}

export function LocalTabs({ children }: LocalTabsProps) {
    return (
        <Tabs defaultValue="general" className="w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">Create Container</h3>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardDescription>General container configuration</CardDescription>
                    </CardHeader>
                    <CardContent>{children[0]}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="advanced">
                <Card>
                    <CardHeader>
                        <CardDescription>Configure advanced settings for the container.</CardDescription>
                    </CardHeader>
                    <CardContent>{children[1]}</CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
