import {PropsWithChildren, ReactNode} from 'react';
import {Link} from '@inertiajs/react';
import {User} from '@/types';
import ThemeProvider from "@/components/app/theme-provider";
import {Toaster} from "@/components/ui/toaster"
import {
    CirclePlus,
    Github,
    Home,
    LibraryBig,
    LineChart,
    Package,
    Package2,
    PanelLeft,
    Server,
    Settings,
    ShoppingCart,
    User as UserIcon,
    Users2,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import DynamicBreadcrumb from "@/components/app/DynamicBreadcrumb";
import ModeToggle from "@/components/app/mode-toggle";

export default function Authenticated({user, header, children}: PropsWithChildren<{ user: User, header?: ReactNode }>) {

    const isRouteActive = (routeName: string) => {
        return route().current(routeName);
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster/>
            <TooltipProvider>
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                            <a
                                href="https://github.com/camilojm27/trabajo-de-grado"
                                target="_blank"
                                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                            >
                                <Github className="h-4 w-4 transition-all group-hover:scale-110"/>
                                <span className="sr-only">Project Code</span>
                            </a>
                            {
                                user.is_admin && <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route('dashboard')}
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                                                isRouteActive('dashboard') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                            }`}>
                                            <Home className="h-5 w-5"/>
                                            <span className="sr-only">Dashboard</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Dashboard</TooltipContent>
                                </Tooltip>
                            }

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route('nodes')}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                                            isRouteActive('nodes') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        <Server className="h-5 w-5"/>
                                        <span className="sr-only">Nodes</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Nodes</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route('containers')}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                                            isRouteActive('containers') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                        }`}>
                                        <Package className="h-5 w-5"/>
                                        <span className="sr-only">Containers</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Containers</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route('containers.create')}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                                            isRouteActive('containers.create') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                        }`}>
                                        <CirclePlus className="h-5 w-5"/>
                                        <span className="sr-only">Add Container</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">Add Container</TooltipContent>
                            </Tooltip>
                            {
                                user.is_admin && <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/users"
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                                                isRouteActive('users.index') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                            }`}>
                                            <Users2 className="h-5 w-5"/>
                                            <span className="sr-only">Users</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Users</TooltipContent>
                                </Tooltip>
                            }

                        </nav>
                        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href="https://camilojm27.github.io/trabajo-de-grado/"
                                        target="_blank"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                    >
                                        <LibraryBig className="h-5 w-5"/>
                                        <span className="sr-only">Documentation</span>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right">Documentation</TooltipContent>
                            </Tooltip>
                            {
                                user.is_admin &&
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/settings/general"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                        >
                                            <Settings className="h-5 w-5"/>
                                            <span className="sr-only">Settings</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Settings</TooltipContent>
                                </Tooltip>
                            }
                        </nav>
                    </aside>
                    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                        <header
                            className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button size="icon" variant="outline" className="sm:hidden">
                                        <PanelLeft className="h-5 w-5"/>
                                        <span className="sr-only">Toggle Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="sm:max-w-xs">
                                    <nav className="grid gap-6 text-lg font-medium">
                                        <Link
                                            href="#"
                                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                                        >
                                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110"/>
                                            <span className="sr-only">Acme Inc</span>
                                        </Link>
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Home className="h-5 w-5"/>
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route('nodes')}
                                            className="flex items-center gap-4 px-2.5 text-foreground"
                                        >
                                            <ShoppingCart className="h-5 w-5"/>
                                            Nodes
                                        </Link>
                                        <Link
                                            href={route('containers')}
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Package className="h-5 w-5"/>
                                            Containers
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <Users2 className="h-5 w-5"/>
                                            Users
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <LineChart className="h-5 w-5"/>
                                            Settings
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                            <DynamicBreadcrumb/>
                            <div className="relative ml-auto flex-1 md:grow-0">

                            </div>
                            <ModeToggle/>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="overflow-hidden rounded-full"
                                    >
                                        <Avatar>
                                            <AvatarFallback>
                                                <UserIcon/>
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Link href={route('profile.edit')} as="button" className="w-full">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>
                                        <Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </header>
                        {children}
                    </div>
                </div>
            </TooltipProvider>
        </ThemeProvider>
    );
}
