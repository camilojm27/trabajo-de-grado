import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {User} from "@/types";
import {Search} from "lucide-react";
import UsersTable from "@/Pages/Users/UsersTable";
import {Input} from "@/components/ui/input";
import {PaginationI} from "@/types/";
import {router} from "@inertiajs/react";


interface UsersProps {
    auth: any
    users: PaginationI<User>,
    queryParams: any
}
export default function Users({auth, users, queryParams } : UsersProps) {
    console.log(users)
    console.log(queryParams)

    const searchFieldChanged = (value: any) => {
        queryParams = value
        router.get(route('users.index', {search: queryParams}))
    }

    const onKeyPress = (e: any) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(e.target.value)
    }
    //https://www.freecodecamp.org/espanol/news/debouncing-en-react-como-retrasar-una-funcion-en-js/

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <main className="grid flex-1 items-start gap-4 p-4 ">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                            <Card x-chunk="dashboard-05-chunk-3">
                                <CardHeader className="px-7">
                                    <CardTitle>Users</CardTitle>
                                    <CardDescription>
                                        Type an user name or email and press enter to search
                                        <div className="relative ml-auto flex-1 md:grow-0 my-1">
                                            <Search
                                                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                type="search"
                                                placeholder="Search..."
                                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                                defaultValue={queryParams.search}
                                                onBlur={(e) =>
                                                searchFieldChanged(e.target.value)
                                            }
                                                onKeyUp={(e) => onKeyPress(e)}
                                            />
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UsersTable users={users}/>
                                </CardContent>
                            </Card>
                </div>
                <div>
                    {/*<NodeDetailLateral node={selectedNode}/>*/}
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
