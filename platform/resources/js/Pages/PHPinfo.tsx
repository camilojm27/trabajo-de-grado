import React from 'react';
import Settings from "@/Layouts/Settings";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";

const PhpInfo = ({auth}: any) => {
    return (
        <Settings auth={auth}>
            <Button variant="link" className="w-5">
                <a href="/phpinfo" target="_blank">
                    <ExternalLink /> External
                </a>
            </Button>
                <iframe
                    src="/phpinfo"
                    style={{width: '100%', height: '100vh', border: 'none'}}
                    title="PHP Info"
                />
        </Settings>
    );
}

export default PhpInfo;
