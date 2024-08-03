import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Link} from "@inertiajs/react";

export function NodeStats() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
            >
                <CardHeader className="pb-3">
                    <CardTitle>Your Nodes</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                        You can check all your nodes and the ones you have access to.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-2">
                    <Button>Add new Node</Button>
                    <Button variant="link">
                        <Link className="w-full" href="/containers/create">Create Container</Link>
                    </Button>
                </CardFooter>
            </Card>
            {/*<Card x-chunk="dashboard-05-chunk-1">*/}
            {/*    <CardHeader className="pb-2">*/}
            {/*        <CardDescription>This Week</CardDescription>*/}
            {/*        <CardTitle className="text-4xl">$1,329</CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*        <div className="text-xs text-muted-foreground">*/}
            {/*            +25% from last week*/}
            {/*        </div>*/}
            {/*    </CardContent>*/}
            {/*    <CardFooter>*/}
            {/*        <Progress value={25} aria-label="25% increase"/>*/}
            {/*    </CardFooter>*/}
            {/*</Card>*/}
            {/*<Card x-chunk="dashboard-05-chunk-2">*/}
            {/*    <CardHeader className="pb-2">*/}
            {/*        <CardDescription>This Month</CardDescription>*/}
            {/*        <CardTitle className="text-4xl">$5,329</CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*        <div className="text-xs text-muted-foreground">*/}
            {/*            +10% from last month*/}
            {/*        </div>*/}
            {/*    </CardContent>*/}
            {/*    <CardFooter>*/}
            {/*        <Progress value={12} aria-label="12% increase"/>*/}
            {/*    </CardFooter>*/}
            {/*</Card>*/}
        </div>
    )
}
