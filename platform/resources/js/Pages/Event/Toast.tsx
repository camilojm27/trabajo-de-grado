import {User} from "@/types";
import {Container} from '@/types/container'
import React from "react";
import {useToast} from "@/components/ui/use-toast";

interface Props {
    auth: {
        user: User;
    };
    event: any;
}

export default function Toast({auth, event}: Props) {
    const {toast} = useToast()

    toast({
        title: event.title,
        description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {event.description}
                    </code>
            </pre>
        ),
    });
    return (
        <span>

        </span>
    );
}
