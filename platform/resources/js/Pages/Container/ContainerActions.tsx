import React from 'react';
import {useToast} from "@/components/ui/use-toast";
import {Link, router} from "@inertiajs/react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
    EyeOpenIcon,
    HobbyKnifeIcon,
    PauseIcon,
    PlayIcon,
    ReloadIcon,
    ResetIcon, ResumeIcon,
    StopIcon,
    TrashIcon
} from "@radix-ui/react-icons";
import {Container} from "@/types/container";
import {PaginationI} from "@/types";
interface ContainersProps {
    container: Container,
}

export default function ContainerActions({container}: ContainersProps) {
    const { toast } = useToast();
    const isItemDisabled = (menuItem: string) => {
        switch (menuItem) {
            // case "restart":
            //     return !(container.state == "paused" || container.state == "running");
            // case "recreate":
            //     //TODO: Make sure we can recreate all containers
            //     return !(container.state == "send" || container.state == "error");
            // case "start":
            //     return !(container.state == "created" || container.state == "exited")
            // case "stop":
            //     return !(container.state == "running" || container.state == "paused" || container.state == "restarting");
            // case "kill":
            //     return !(container.state == "created" || container.state == "error");
            // case "pause":
            //     return !(container.state == "running");
            // case "unpause":
            //     return !(container.state == "paused");
            // case "delete":
            //     return false
            default:
                return false;
        }
    };

    const sendOrderToContainer = (order: string) => () => {
        router.post(
            `/containers/${order}/${container.id}`,
            {},
            {
                onSuccess: () => {
                    toast({
                        title: `${order} sent`,
                        description: <span className="text-white"></span>,
                    });
                },
                onError: () => {
                    toast({
                        title: "Container send",
                        variant: "destructive",
                        description: (
                            <span className="text-white">
                  Error sending {order} order to container.
                  Verify the RabbitMQ server is running.
                </span>
                        ),
                    });
                },
            }
        );
    };

    // @ts-ignore
    const ActionButton = ({ action, icon, tooltip }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={isItemDisabled(action)}
                        onClick={sendOrderToContainer(action)}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <div className="flex flex-wrap gap-2">
            {/*<Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(container.container_id)}>*/}
            {/*    Copy Node ID*/}
            {/*</Button>*/}
            {/*<Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(String(container.id))}>*/}
            {/*    Copy Platform ID*/}
            {/*</Button>*/}
            <Link href={`/containers/show/${container.id}`}>
                <Button variant="outline" size="icon">
                    <EyeOpenIcon className="h-4 w-4" />
                </Button>
            </Link>
            <ActionButton action="restart" icon={<ReloadIcon className="h-4 w-4" />} tooltip="Restart Container" />
            <ActionButton action="recreate" icon={<ResetIcon className="h-4 w-4" />} tooltip="Recreate Container" />
            <ActionButton action="start" icon={<PlayIcon className="h-4 w-4" />} tooltip="Start Container" />
            <ActionButton action="stop" icon={<StopIcon className="h-4 w-4" />} tooltip="Stop Container" />
            <ActionButton action="kill" icon={<HobbyKnifeIcon className="h-4 w-4" />} tooltip="Kill Container" />
            <ActionButton action="delete" icon={<TrashIcon className="h-4 w-4" />} tooltip="Delete Container" />
            <ActionButton action="pause" icon={<PauseIcon className="h-4 w-4" />} tooltip="Pause Container" />
            <ActionButton action="unpause" icon={<ResumeIcon className="h-4 w-4" />} tooltip="Unpause Container" />
            <Link href={`/nodes/${container.node_id}`}>
                <Button variant="outline" size="sm">
                    View Node
                </Button>
            </Link>
        </div>
    );
}

