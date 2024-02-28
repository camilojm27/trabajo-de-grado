import {Link} from '@inertiajs/react'
import {Separator} from "@/components/ui/separator.jsx"
import {CardTitle, CardHeader, CardContent, Card, CardFooter} from "@/components/ui/card.jsx"
import {ResponsiveLine} from "@nivo/line"
import {ResponsiveBar} from "@nivo/bar"
import {Button} from "@/components/ui/button.jsx"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { User } from "@/types";
import { Node } from "@/types/node";

interface Props {
    auth: {
        user: User;
    };
    node: Node;
}

export default function NodeDetail({auth, node}: Props) {
    const {attributes} = node

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<div className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                <Link
                    className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4"
                    href="#">
                    <ServerIcon className="w-6 h-6"/>
                    <span className="sr-only">Server Dashboard</span>
                </Link>
                <nav
                    className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
                    <Link className="font-bold" href="#">
                        Server Details
                    </Link>
                    <Link className="text-gray-500 dark:text-gray-400" href={`/containers/${node.id}`}>
                        Containers
                    </Link>
                    <Link className="text-gray-500 dark:text-gray-400" href="#">
                        Settings
                    </Link>
                </nav>
            </div>
            }
        >
            <div className="flex flex-col w-full min-h-screen bg-white">

                <main
                    className="flex min-h-[calc(100vh-_theme(spacing.16))]  flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-900">
                    <div className="max-w-6xl w-full mx-auto grid gap-2">
                        <h1 className="font-semibold text-3xl">Server Details</h1>
                        <div className="flex items-center text-sm gap-2">
                            <a className="font-medium" href="#" target="_blank">
                                linux-server.example.com
                            </a>
                            <Separator className="h-5" orientation="vertical"/>
                            <div className="text-gray-500 flex items-center gap-2 dark:text-gray-400">
              <span
                  className="inline-block w-2 h-2 bg-[#09CE6B] rounded-full animate-ping duration-[5000]"/>
                                Online
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-6 max-w-6xl w-full mx-auto lg:grid-cols-2">
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Hardware Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm p-6">
                                <div className="flex items-center">
                                    <div>CPU Type</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.cpu}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>RAM</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.ram}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>SWAP</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.swap}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Disk (root "/")</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.disk}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Disk Available (root "/")</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.disk_available}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>GPU</div>
                                    <div className="font-semibold ml-auto">{attributes.hardware.gpu}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Node Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm p-6">
                                <div className="flex items-center">
                                    <div>Python Version</div>
                                    <div className="font-semibold ml-auto">{attributes.software.python}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Docker Version</div>
                                    <div className="font-semibold ml-auto">{attributes.software.docker}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>PHP Version</div>
                                    <div className="font-semibold ml-auto">{attributes.software.php.toString().slice(0,10)}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Composer Version</div>
                                    <div className="font-semibold ml-auto">{attributes.software.composer}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Node JS</div>
                                    <div className="font-semibold ml-auto">{attributes.software.nodejs}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>NPM</div>
                                    <div className="font-semibold ml-auto">{attributes.software.npm}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Key Network Settings</div>
                                    <div className="font-semibold ml-auto">NAT</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Operating System Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm p-6">
                                <div className="flex items-center">
                                    <div>OS</div>
                                    <div className="font-semibold ml-auto">{attributes.os.fullname}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Kernel Version</div>
                                    <div className="font-semibold ml-auto">{attributes.os.kernel}</div>
                                </div>
                                <div className="flex items-center">
                                    <div>Arch</div>
                                    <div className="font-semibold ml-auto">{attributes.os.arch[0]}  {attributes.os.arch[1]}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Network Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CurvedlineChart className="w-full aspect-[4/3]"/>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Resource Usage</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <BarChart className="w-full aspect-[4/3]"/>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Logs</CardTitle>
                            </CardHeader>
                            <CardFooter
                                className="pb-4 px-6 justify-center bg-gradient-to-b from-background/50 to-background absolute inset-x-0 bottom-0">
                                <Button
                                    className="gap-2 rounded-full bg-white dark:bg-gray-950"
                                    size="sm"
                                    variant="outline">
                                    View Logs
                                    <Maximize2Icon className="w-4 h-4"/>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}


function ServerIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
            <line x1="6" x2="6.01" y1="6" y2="6"/>
            <line x1="6" x2="6.01" y1="18" y2="18"/>
        </svg>)
    );
}


function CurvedlineChart(props) {
    return (
        (<div {...props}>
            <ResponsiveLine
                data={[
                    {
                        id: "B",
                        data: [
                            {x: "2018-01-01", y: 7},
                            {x: "2018-01-02", y: 5},
                            {x: "2018-01-03", y: 11},
                            {x: "2018-01-04", y: 9},
                            {x: "2018-01-05", y: 12},
                            {x: "2018-01-06", y: 16},
                            {x: "2018-01-07", y: 13},
                            {x: "2018-01-08", y: 13},
                        ],
                    },
                    {
                        id: "A",
                        data: [
                            {x: "2018-01-01", y: 9},
                            {x: "2018-01-02", y: 8},
                            {x: "2018-01-03", y: 13},
                            {x: "2018-01-04", y: 6},
                            {x: "2018-01-05", y: 8},
                            {x: "2018-01-06", y: 14},
                            {x: "2018-01-07", y: 11},
                            {x: "2018-01-08", y: 12},
                        ],
                    },
                ]}
                enableCrosshair={false}
                margin={{top: 50, right: 110, bottom: 50, left: 60}}
                xScale={{
                    type: "time",
                    format: "%Y-%m-%d",
                    useUTC: false,
                    precision: "day",
                }}
                xFormat="time:%Y-%m-%d"
                yScale={{
                    type: "linear",
                    min: 0,
                    max: "auto",
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "X",
                    legendOffset: 45,
                    legendPosition: "middle",
                    format: "%b %d",
                    tickValues: "every 1 day",
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Y",
                    legendOffset: -45,
                    legendPosition: "middle",
                }}
                colors={{scheme: "paired"}}
                pointSize={5}
                pointColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                }}
                pointBorderWidth={2}
                pointBorderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                }}
                pointLabelYOffset={-12}
                useMesh={true}
                curve="monotoneX"
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        symbolSize: 14,
                        symbolShape: "circle",
                    },
                ]}
                theme={{
                    tooltip: {
                        container: {
                            fontSize: "12px",
                        },
                    },
                }}
                role="application"/>
        </div>)
    );
}


function BarChart(props) {
    return (
        (<div {...props}>
            <ResponsiveBar
                data={[
                    {
                        name: "A",
                        data: 111,
                    },
                    {
                        name: "B",
                        data: 157,
                    },
                    {
                        name: "C",
                        data: 129,
                    },
                    {
                        name: "D",
                        data: 187,
                    },
                    {
                        name: "E",
                        data: 119,
                    },
                    {
                        name: "F",
                        data: 22,
                    },
                    {
                        name: "G",
                        data: 101,
                    },
                    {
                        name: "H",
                        data: 83,
                    },
                ]}
                keys={["data"]}
                indexBy="name"
                margin={{top: 50, right: 50, bottom: 50, left: 60}}
                padding={0.3}
                valueScale={{type: "linear"}}
                indexScale={{type: "band", round: true}}
                colors={{scheme: "paired"}}
                borderWidth={1}
                borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Name",
                    legendPosition: "middle",
                    legendOffset: 45,
                    truncateTickAt: 0,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Number",
                    legendPosition: "middle",
                    legendOffset: -45,
                    truncateTickAt: 0,
                }}
                theme={{
                    tooltip: {
                        container: {
                            fontSize: "12px",
                        },
                    },
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                role="application"
                ariaLabel="A bar chart showing data"/>
        </div>)
    );
}


function Maximize2Icon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" x2="14" y1="3" y2="10"/>
            <line x1="3" x2="10" y1="21" y2="14"/>
        </svg>)
    );
}
