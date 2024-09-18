import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {Trash, UserCheck, UserRoundPen, UserX} from "lucide-react";
import {PaginationI, User} from "@/types";
import {Head, router} from '@inertiajs/react';
import {Button} from "@/components/ui/button";
import LaraPagination from "@/components/app/LaraPagination";
import {toast} from "@/components/ui/use-toast";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface UsersProps {
    users: PaginationI<User>
}

type SortField = 'owner' | 'hostname' | 'id' | 'ip_address';
type SortOrder = 'asc' | 'desc';

export default function UsersTable({users}: UsersProps) {


    function handleSort(id: string) {
    }

    function handleBan(id: number) {
        router.patch(`/users/ban/${id}`, {}, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (e) => {
                console.log(e)
                toast({
                    title: 'User banned successfully',
                });
            },
            onError: (errors) => {
                console.log(errors)
                toast({
                    title: errors.message,
                    variant: 'destructive',
                });
            },
        });
    }

    function handleUnban(id: number) {
        router.patch(`/users/unban/${id}`, {}, {  //TODO: Make a generic function about this
            preserveState: false,
            preserveScroll: true,
            onSuccess: (data) => {
                console.log(data)
                toast({
                    title: 'User Unbanned successfully',
                });
            },
            onError: (errors) => {
                toast({
                    title: errors.message,
                    variant: 'destructive',
                });
            },
        });
    }

    function handleDelete(id: number) {
        router.delete(`/users/${id}`, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (data) => {
                console.log(data)
                toast({
                    title: 'User deleted successfully',
                });
            },
            onError: (errors) => {
                toast({
                    title: errors.message,
                    variant: 'destructive',
                });
            },
        });
    }

    return (
        <>
            <Head title="Users"/>
            <div className="py-12">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                                    ID {/* Add SortIcon component here */}
                                </TableHead>
                                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                                    Username {/* Add SortIcon component here */}
                                </TableHead>
                                <TableHead onClick={() => handleSort('email')}
                                           className="hidden sm:table-cell cursor-pointer">
                                    Email {/* Add SortIcon component here */}
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Role
                                </TableHead> <TableHead className="hidden sm:table-cell">
                                Actions
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="font-medium">{user.email}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {user.is_admin ? 'Admin' : 'User'}
                                    </TableCell>
                                    <TableCell className="flex justify-around">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <div className="flex flex-row items-center gap-1 hover:cursor-pointer">
                                                    <Trash size={18}/> Delete
                                                </div>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Do you want to delete the user {user.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete data
                                                        from our server
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction  onClick={() => handleDelete(user.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button variant='secondary'><UserRoundPen/>Edit User</Button>
                                        {
                                            user.is_banned ?
                                                <Button variant='secondary'
                                                        onClick={() => handleUnban(user.id)}><UserCheck/>Unblock
                                                    User</Button>
                                                :
                                                <Button variant='secondary'
                                                        onClick={() => handleBan(user.id)}><UserX/> Block User</Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <LaraPagination paginationObject={users}/>

                </div>
            </div>
        </>
    )
}
