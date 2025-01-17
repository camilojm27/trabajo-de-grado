import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import {User} from '@/types';
import {Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis,} from "recharts"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import ContainerStatusChart from "@/Pages/Dashboard/ContainerStatusChart";
import NodeOnlineChart from "@/Pages/Dashboard/NodeOnlineChart";


interface DashboardProps {
    auth: {
        user: User;
    };
    nodesAddedThisWeek: [];
    nodesAddedEachDayThisWeek: [];
    nodesCreatedToday: [];
    nodesCreatedByUser: [];
    nodesInTotal: number;
    nodesOnlineCount: number;
    nodesOfflineCount: number;
    nodesOnline: any;
    containerStateCount: any;
    dashboardData: {
        nodes: any[];
        containers: any[];
        users: any[];
        systemMetrics: {
            cpu_usage: number;
            mem_usage: number;
        };
    };
}
import { YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import React from 'react';
// Format dates consistently
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const sortByCreatedAt = (a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
};

const DashboardCharts = ({ dashboardData }) => {
    // Group containers by image and count occurrences
    const containersByImage = dashboardData.containers.reduce((acc, container) => {
        // Limpiar el nombre de la imagen: remover el sha256 y tomar solo el nombre base
        let image = container.image.split('@sha256:')[0]; // Remover el sha256 si existe
        image = image.split(':')[0]; // Tomar solo el nombre base sin el tag
        acc[image] = (acc[image] || 0) + 1;
        return acc;
    }, {});

    const dockerImagesData = Object.entries(containersByImage)
        .map(([image, usage]) => ({ image, usage }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5); // Take top 5 most used images

    // Get latest registered nodes
    const latestNodes = [...dashboardData.nodes]
        .sort(sortByCreatedAt)
        .slice(0, 5);

    // Get users with most nodes
    const userNodesCount = {};
    dashboardData.nodes.forEach(node => {
        const userId = node.created_by;
        const user = dashboardData.users.find(u => u.id === userId);
        if (user) {
            userNodesCount[user.name] = (userNodesCount[user.name] || 0) + 1;
        }
    });

    const usersWithMostNodes = Object.entries(userNodesCount)
        .map(([user, nodes]) => ({
            user,
            nodes: Math.round(nodes) // Redondear a números enteros
        }))
        .sort((a, b) => b.nodes - a.nodes)
        .slice(0, 5);

    // Calculate server metrics
    const serverMetrics = {
        cpu: dashboardData.systemMetrics?.cpu_usage || 0,
        ram: dashboardData.systemMetrics?.mem_usage || 0,
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Users with most nodes */}
            <Card className="dark:bg-gray-800 dark:text-gray-200">
                <CardHeader>
                    <CardTitle>Users with Most Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart width={400} height={300} data={usersWithMostNodes} barSize={30}>
                        <XAxis
                            dataKey="user"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="nodes" fill="var(--color-primary)" />
                    </BarChart>
                </CardContent>
            </Card>

            {/* Most Used Docker Images */}
            <Card className="dark:bg-gray-800 dark:text-gray-200">
                <CardHeader>
                    <CardTitle>Most Used Docker Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={dockerImagesData}
                            dataKey="usage"
                            nameKey="image"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {dockerImagesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </CardContent>
            </Card>

            {/* Latest Registered Nodes */}
            <Card>
                <CardHeader>
                    <CardTitle>Latest Registered Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {latestNodes.map((node) => (
                            <li key={node.id}>
                                <div className="flex justify-between">
                                    <h4 className="font-medium">{node.hostname}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(node.created_at)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Server Usage Metrics */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Server Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium">CPU</h4>
                            <p className="text-4xl">{serverMetrics.cpu.toFixed(1)}%</p>
                        </div>
                        <div>
                            <h4 className="font-medium">RAM</h4>
                            <p className="text-4xl">{serverMetrics.ram.toFixed(1)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function Dashboard({
                                      auth,
                                      nodesAddedEachDayThisWeek,
                                      nodesAddedThisWeek,
                                      nodesOnline,
                                      nodesCreatedByUser,
                                      nodesCreatedToday,
                                      nodesInTotal,
                                      containerStateCount,
                                      nodesOnlineCount,
                                      nodesOfflineCount,
                                      dashboardData
                                  }: DashboardProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard"/>

            <div
                className="chart-wrapper mx-auto flex flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
                <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
                    <Card
                        className="lg:max-w-md" x-chunk="charts-01-chunk-0"
                    >
                        <CardHeader className="space-y-0 pb-2">
                            <CardDescription>Today</CardDescription>
                            <CardTitle className="text-4xl tabular-nums">
                                {nodesCreatedToday.length + " "}
                                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                Nodes
              </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    count: {
                                        label: "Count",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                            >
                                <BarChart
                                    accessibilityLayer
                                    margin={{
                                        left: -4,
                                        right: -4,
                                    }}
                                    data={nodesAddedEachDayThisWeek}
                                >
                                    <Bar
                                        dataKey="count"
                                        fill="var(--color-count)"
                                        radius={5}
                                        fillOpacity={0.6}
                                        activeBar={<Rectangle fillOpacity={0.8}/>}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={4}
                                        tickFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                weekday: "short",
                                            })
                                        }}
                                    />
                                    <ChartTooltip
                                        defaultIndex={2}
                                        content={
                                            <ChartTooltipContent
                                                hideIndicator
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })
                                                }}
                                            />
                                        }
                                        cursor={false}
                                    />
                                    <ReferenceLine
                                        y={1200}
                                        stroke="hsl(var(--muted-foreground))"
                                        strokeDasharray="3 3"
                                        strokeWidth={1}
                                    >
                                        <Label
                                            position="insideBottomLeft"
                                            value="Average Steps"
                                            offset={10}
                                            fill="hsl(var(--foreground))"
                                        />
                                        <Label
                                            position="insideTopLeft"
                                            value="12,343"
                                            className="text-lg"
                                            fill="hsl(var(--foreground))"
                                            offset={10}
                                            startOffset={100}
                                        />
                                    </ReferenceLine>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-1">
                            <CardDescription>
                                Over the past 7 days, have been added {" "}
                                <span className="font-medium text-foreground">{nodesAddedThisWeek.length}</span> nodes.
                            </CardDescription>
                        </CardFooter>
                    </Card>

                </div>
                <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">


                    <NodeOnlineChart onlineCount={nodesOnlineCount} offlineCount={nodesOfflineCount}/>

                </div>
                <div className="grid w-full flex-1 gap-6">
                    <ContainerStatusChart containerStates={containerStateCount}/>

                </div>
            </div>
            <div className="chart-wrapper mx-auto flex ">
                {/* Pass dashboardData to DashboardCharts */}
                <div className="chart-wrapper mx-auto flex p-6">
                    {dashboardData && <DashboardCharts dashboardData={dashboardData} />}
                </div>            </div>
        </AuthenticatedLayout>
    );
}
