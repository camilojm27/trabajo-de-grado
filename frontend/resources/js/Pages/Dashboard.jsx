import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "@/components/ui/use-toast"
import {useForm} from "react-hook-form"
import {router} from '@inertiajs/react'


export default function Dashboard({auth}) {
    const { errors } = usePage().props

    const form = useForm({
        defaultValues: {
            name: null,
            image: null,
            ports: null
        },
    })

    function onSubmit(data) {
        router.post('/containers', data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la imagen</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ubuntu:22" {...field} />
                                            </FormControl>
                                            {errors.image && <div className='text-red-600'>{errors.image}</div>}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Contenedor (nombre que deseas darle)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="El_mejor_container" {...field} />
                                            </FormControl>
                                            {errors.name && <div className='text-red-600'>{errors.name}</div>}

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ports"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Puertos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="80:80" {...field} />
                                            </FormControl>
                                            {errors.ports && <div className='text-red-600'>{errors.ports}</div>}

                                        </FormItem>
                                    )}
                                />
                                <FormDescription>
                                    Cuando el servidor este disponible se creará el contenedor.
                                </FormDescription>
                                <FormMessage/>
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
