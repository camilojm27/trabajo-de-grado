// components/ContainerMetrics.jsx
import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import RamUsage from "@/components/app/RamUsage";
import CpuUsage from "@/components/app/CpuUsage";
import NetUsage from "@/components/app/NetUsage";
import axios from "axios";
import {User} from "@/types";
import {Container} from "@/types/container";

interface Props {

    container: Container;
}

const ContainerMetrics = ({ container }: Props) => {
    // @ts-ignore
    const {Echo} = window;

    const [metrics, setMetrics] = useState({
        mem_limit: 0,
        mem_free: 0,
        cpu_percent: 0,
        net_input: 0,
        net_output: 0,
    });

    useEffect(() => {
        Echo.private(`container-metrics-${container.container_id}`)
            .listen('ContainerMetricsUpdated', (data: any) => {
                setMetrics(data.metrics);
            });

        return () => {
            Echo.leave(`container-metrics-${container.container_id}`);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (Echo) {
                axios.post(`/containers/metrics/${container.id}`)
                    .then(response => console.log('Metrics sent:', response))
                    .catch(error => console.error('Error sending metrics:', error));
            } else {
                console.log('Echo not loaded yet');
            }
        }, 2000);
    }, []);

    return (
        <>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center border-b">
                    <CardTitle>RAM Usage</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <RamUsage data={{
                        mem_total: metrics.mem_limit,
                        mem_available: metrics.mem_limit - metrics.mem_free,
                        swap_total: 0,
                        swap_used: 0,
                    }} />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center border-b">
                    <CardTitle>CPU Load</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <CpuUsage cpuUsage={metrics.cpu_percent} />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center border-b">
                    <CardTitle>Networks</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <NetUsage data={{
                        bytesSent: metrics.net_input,
                        bytesRecv: metrics.net_output,
                    }} />
                </CardContent>
            </Card>
        </>
    );
};

export default ContainerMetrics;
