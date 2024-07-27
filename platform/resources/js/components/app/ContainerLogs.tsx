// components/ContainerLogs.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import {Container} from "@/types/container";
interface Props {

    container: Container;
}

const ContainerLogs = ({ container }: Props) => {
    // @ts-ignore
    const {Echo} = window;

    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        Echo.private(`container-logs-${container.container_id}`)
            .listen('ContainerLogsUpdated', (data: any) => {
                console.log("BROADCASTED LOGS", data);
                if (data.logs) {
                    setLogs(prevLogs => [...prevLogs, data.logs].slice(-1000));
                }
            });

        return () => {
            Echo.leave(`container-logs-${container.container_id}`);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    useEffect(() => {
        window.setTimeout(() => {
            if (Echo) {
                axios.post(`/containers/logs/${container.id}`)
                    .then((data) => {
                        console.log('Logs sent:', data)
                        if (data.data.logs) {
                            setLogs([data.data.logs]);
                        }
                    })
                    .catch(error => console.error('Error sending logs:', error));
            } else {
                console.log('Echo not loaded yet');
            }
        }, 2000);
    }, []);

    return (
        <Card className="relative overflow-auto">
            <CardHeader className="flex flex-row items-center border-b">
                <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-96 overflow-auto">
                {logs.length > 0 ? (
                    <pre className="p-6 text-xs bg-gray-100 dark:bg-gray-800">
                        {logs.join('\n')}
                        <div ref={logsEndRef} />
                    </pre>
                ) : (
                    <p className="p-6 text-xs text-gray-500">No logs available</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ContainerLogs;
