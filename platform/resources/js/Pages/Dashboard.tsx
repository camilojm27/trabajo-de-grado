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
    nodesAddedThisWeek: []
    nodesAddedEachDayThisWeek: []
    nodesCreatedToday: []
    nodesCreatedByUser: []
    nodesInTotal: number,
    nodesOnlineCount: number,
    nodesOfflineCount: number,
    nodesOnline: any,
    containerStateCount: any
}

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
                                      nodesOfflineCount
                                  }: DashboardProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard"/>

            <div
                className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
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
        </AuthenticatedLayout>
    );
}
