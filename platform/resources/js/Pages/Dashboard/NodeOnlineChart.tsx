import {TrendingUp} from "lucide-react"
import {Label, PolarRadiusAxis, RadialBar, RadialBarChart} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


export default function NodeOnlineChart({onlineCount, offlineCount}: { onlineCount: number, offlineCount: number }) {

    const chartData = [{onlineCount, offlineCount}]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-5))",
        },
        mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const totalVisitors = chartData[0].onlineCount + chartData[0].offlineCount

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Nodes Status</CardTitle>
                <CardDescription>Online - Offline</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({viewBox}) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    Nodes Registered
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="onlineCount"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-mobile)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="offlineCount"
                            fill="var(--color-desktop)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
