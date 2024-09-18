import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios';
import {Container} from "@/types/container";
import {Activity, Download, Trash} from "lucide-react";
import {router} from "@inertiajs/react";
import {toast} from "@/components/ui/use-toast";
interface Props {

    container: Container;
}

const ContainerLogs = ({ container }: Props) => {
    const [isDisabled, setIsDisabled] = useState(false);
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

    function requestLogs() {
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
    }

    return (
        <Card className="relative overflow-auto">
            <CardHeader className="flex flex-row items-center border-b">
                <CardTitle>Logs</CardTitle>
                <div className="ml-auto space-x-2">
                    <Button variant="outline" onClick={() => {requestLogs()}}>
                        <Activity className="h-4 w-4" />
                        New Logs
                    </Button>
                    <Button variant="outline" onClick={() => {setLogs([]);}}>
                        <Trash className="h-4 w-4" />
                        Clear Logs
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <Download className="h-4 w-4" />
                                Download Full Logs
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Download Full Logs</AlertDialogTitle>
                                <AlertDialogDescription>
                                    The logs shown on the previous screen are the last 1000 lines from the container.
                                    You can download the complete log file here.

                                    the full log file is from this <strong>{container.log_timestamp}</strong>  date, you can request a fresh file from the container
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                {container.log_download_link && container.log_timestamp &&
                                    <Button id="downloadlink" disabled={isDisabled}>
                                        <a href={container.log_download_link} target="_blank" rel="noopener noreferrer">
                                            {isDisabled ? `Download log from ${container.log_timestamp}` : 'Download Log' }
                                        </a>
                                    </Button>
                                }

                                <Button
                                    onClick={() => {
                                        router.post(`/containers/logfile/${container.id}`, {}, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                toast({
                                                    title: 'Log requested successfully',
                                                });
                                                setIsDisabled(true)
                                                window.setTimeout(() => {
                                                        router.reload()
                                                    setIsDisabled(false)
                                                }, 2000);
                                            },
                                            onError: (errors) => {
                                                toast({
                                                    title: 'Error creating container',
                                                    description: 'Please check the form for errors and try again.',
                                                    variant: 'destructive',
                                                });
                                            },
                                        });
                                    }}
                                >
                                    Request New File
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
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
