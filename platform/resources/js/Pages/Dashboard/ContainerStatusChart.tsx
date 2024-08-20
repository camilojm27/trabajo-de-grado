import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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



export default function ContainerStatusChart({containerStates}: any) {
    console.log(containerStates)

    const chartData = Object.entries(containerStates).map(([state, count]) => ({
        state,
        count,
        fill: `var(--color-${state})`
    }))

    const chartConfig = Object.fromEntries(
        Object.keys(containerStates).map((state, index) => [
            state,
            {
                label: state.charAt(0).toUpperCase() + state.slice(1),
                color: `hsl(var(--chart-${index + 1}))`
            }
        ])
    )

    chartConfig.count = {color: "", label: "Count" }


    const totalContainers = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + (curr.count as number), 0);
    }, [chartData]);


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Container States</CardTitle>
                <CardDescription>Current container states distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="state"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalContainers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Containers
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    <strong>{chartData[0]?.state}</strong>  is the most common state
                </div>
                <div className="leading-none text-muted-foreground text-center">
                    Showing current distribution of container states
                </div>
            </CardFooter>
        </Card>
    )
}
