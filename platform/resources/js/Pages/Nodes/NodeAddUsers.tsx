import React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Node} from "@/types/node";
import {router} from "@inertiajs/react";
import {toast} from "@/components/ui/use-toast";
import {Users, Trash2} from "lucide-react";

interface NodeAddUsersProps {
    node: Node;
}

export function NodeAddUsers({node}: NodeAddUsersProps) {

    const formSchema = z.object({
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(`/nodes/${node.id}/users`, values, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "User added successfully.",
                    variant: "default",
                });
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: JSON.stringify(error?.email) ||
                        JSON.stringify(error) ||
                        "Failed to add user.",
                    variant: "destructive",
                });
            }

        });
    }

    function deleteUser(userId: string) {
        router.delete(`/nodes/${node.id}/users/${userId}`, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "User removed successfully.",
                    variant: "default",
                });
            },
            onError: (error: any) => {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to remove user.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Users/> Manage Users</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Users with access to {node.hostname}</DialogTitle>
                </DialogHeader>
                <div>
                    <ul>
                        {node.users?.map((user) => (
                            <li key={user.id} className="flex justify-between items-center">
                                <span>{user.name} ({user.email})</span>
                                <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id.toString())}>
                                    <Trash2 className="text-red-500"/>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>User Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Add User
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
