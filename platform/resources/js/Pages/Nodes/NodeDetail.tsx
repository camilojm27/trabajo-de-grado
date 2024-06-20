import {Link, router} from '@inertiajs/react'
import {Separator} from "@/components/ui/separator.jsx"
import {CardTitle, CardHeader, CardContent, Card, CardFooter} from "@/components/ui/card.jsx"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { User } from "@/types";
import { Node } from "@/types/node";
import {SVGProps, useEffect, useRef, useState} from 'react'
import {JSX} from 'react/jsx-runtime'
import CpuUsage from "@/components/app/CpuUsage";
import RamUsage from "@/components/app/RamUsage";
import NetUsage from "@/components/app/NetUsage";
import axios from "axios";

interface Props {
    auth: {
        user: User;
    };
    node: Node;
}

export default function NodeDetail({auth, node}: Props) {
    // @ts-ignore
    const attributes = JSON.parse(node.attributes)
    const node_id = node.id;
    const chartRef = useRef(null);
    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramData, setRamData] = useState({});
    const [netData, setNetData] = useState(null);

    const [isActive, setIsActive] = useState(true);

    // Detect user activity
    useEffect(() => {
        const handleUserActivity = () => {
            setIsActive(true);
            // Set a timeout to reset activity after 30 seconds of inactivity
            clearTimeout(window.userActivityTimeout);
            window.userActivityTimeout = setTimeout(() => setIsActive(false), 5000);
        };

        // Add event listeners for user activity
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('touchstart', handleUserActivity);
            clearTimeout(window.userActivityTimeout);
        };
    }, []);

    // Trigger metrics collection every 30 seconds if the user is active
    useEffect(() => {
            if (isActive) {
                axios.post(`/nodes/metrics/${node.id}`)
                    .then(response => console.log('Metrics sent:', response))
                    .catch(error => console.error('Error sending metrics:', error));
            }

    }, [isActive, node.id]);



    useEffect(() => {
        // @ts-ignore
        window.Echo.private(`node-metrics-${node_id}`)
            .listen('NodeMetricsUpdated', (data: any) => {
                console.table(data.metrics)
                setCpuUsage(data.metrics.cpu_usage)
                setRamData(data.metrics)
                setNetData(data.metrics.NetIO[0])
            });

        return () => {
            // @ts-ignore
            window.Echo.leave(`container-metrics-${node_id}`);
        };
    }, [cpuUsage, ramData, netData]);
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
                                    <div
                                        className="font-semibold ml-auto">{attributes.software.php.toString().slice(0, 10)}</div>
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
                                    <div
                                        className="font-semibold ml-auto">{attributes.os.arch}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>RAM Usage</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RamUsage data={ramData}/>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>CPU Load</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CpuUsage cpuUsage={cpuUsage}/>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center border-b">
                                <CardTitle>Networks</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <NetUsage data={netData}/>
                            </CardContent>
                            <CardFooter
                                className="pb-4 px-6 justify-center bg-gradient-to-b from-background/50 to-background absolute inset-x-0 bottom-0">
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}


function ServerIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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



function Maximize2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
