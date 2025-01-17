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

interface ContainerStateCount {
    [key: string]: number;
}

export default function ContainerStatusChart({containerStates}: { containerStates: ContainerStateCount }) {
    // Convert containerStates object to array format for chart
    const chartData = Object.entries(containerStates).map(([state, count]) => ({
        state,
        count,
        fill: `var(--color-${state})`
    }));

    // Find the most common state
    const getMostCommonState = () => {
        if (!chartData || chartData.length === 0) return null;

        return chartData.reduce((prev, current) => {
            return (prev.count > current.count) ? prev : current;
        }).state;
    };

    const mostCommonState = getMostCommonState();

    const chartConfig = Object.fromEntries(
        Object.keys(containerStates).map((state, index) => [
            state,
            {
                label: state.charAt(0).toUpperCase() + state.slice(1),
                color: `hsl(var(--chart-${index + 1}))`
            }
        ])
    );

    chartConfig.count = {color: "", label: "Count"}

    const totalContainers = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + (curr.count as number), 0);
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Estado de contenedores</CardTitle>
                <CardDescription>Distribución del estado de los contenedores</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="state"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({viewBox}) => {
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
                    <strong>{mostCommonState}</strong> es el estado más común con{' '}
                    <strong>{containerStates[mostCommonState]}</strong> contenedores
                </div>
                <div className="leading-none text-muted-foreground text-center">
                </div>
            </CardFooter>
        </Card>
    )
}
