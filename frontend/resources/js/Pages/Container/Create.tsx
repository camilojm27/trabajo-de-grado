import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, usePage} from '@inertiajs/react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {router} from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from '@radix-ui/react-dropdown-menu';
import { Trash2 } from 'lucide-react';
import { User } from '@/types';
import {Node} from "@/types/node"

interface Props {
    auth: {
        user: User
    }
    nodes: Node[]
}

export default function Create({auth, nodes}: Props) {
const { toast } = useToast()


    const formSchema = z.object({
        node: z.string().uuid(),
        name: z.string().min(3).max(100),
        image: z.string().min(3).max(100),
        ports: z
            .array(
                z
                    .string()
                    .regex(
                        /^(?:(?:\d{1,5}|(?:\d{1,3}\.){3}\d{1,3}):)?(\d{1,5})(?::(\d{1,5}))?(?:\/(tcp|udp|sctp))?$/
                    )
            )
            .min(0),
        env: z
            .array(
                z.object({ name: z.string().min(1), value: z.string().min(1) })
            )
            .min(0),
    });

    //TODO: Eliminar los valores de prueba
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues: {
            node: "9b5acc36-e6a5-4ab2-81f4-9edca73a165b",
            name: "Hola Mundo",
            image: "ubuntu:24.04",
            ports: [],
            env: [{ name: 'holapp', value: 'mundoo' }],
    },
  })

  const { register, control, handleSubmit, setError, formState: { errors } } = form

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        //router.post('/containers', data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    const envFields = useFieldArray({
    control,
    name: 'env',
  });


  const portFields = useFieldArray({
    control,
    name: 'ports',
  });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Link href="/containers">
                    <Button variant="outline">Lista de contenedores</Button>
                </Link>
            }
        >
            <Head title="Containers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div> */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-2/3 space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="node"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="w-full">
                                                Selecciona el nodo donde quieres
                                                crear el contenedor:
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[320px]">
                                                    <SelectValue placeholder="Seleccionar un nodo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {nodes &&
                                                        nodes.map(
                                                            (node, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={
                                                                        node.id
                                                                    }
                                                                >
                                                                    {node.name ||
                                                                        node.id}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nombre de la imagen
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ubuntu:24.04"
                                                    {...field}
                                                />
                                            </FormControl>
                                            {errors.image && (
                                                <div className="text-red-600">
                                                    {errors.image.message}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nombre del Contenedor (nombre
                                                que deseas darle)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Noble Numbat"
                                                    {...field}
                                                />
                                            </FormControl>
                                            {errors.name && (
                                                <div className="text-red-600">
                                                    {errors.name.message}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Variables de entorno
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[725px] ">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Agregar Variables de entorno
                                            </DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile
                                                here. Click save when you're
                                                done.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {envFields.fields.map(
                                            (field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex space-x-4 items-center"
                                                >
                                                    <Label className="w-full">
                                                        Nombre:
                                                        <Input
                                                            type="text"
                                                            {...register(
                                                                `env.${index}.name`
                                                            )}
                                                        />
                                                    </Label>
                                                    <Label className=" w-full">
                                                        Valor:
                                                        <Input
                                                            type="text"
                                                            {...register(
                                                                `env.${index}.value`
                                                            )}
                                                        />
                                                    </Label>
                                                    {envFields.fields.length >
                                                        1 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                envFields.remove(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                envFields.append({
                                                    name: "",
                                                    value: "",
                                                })
                                            }
                                        >
                                            {" "}
                                            Agregar nueva variable
                                        </Button>
                                        {/* <DialogFooter>
                                            <Button type="submit">
                                                Save changes
                                            </Button>
                                        </DialogFooter> */}
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Puertos
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[725px] ">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Agregar Puertos
                                            </DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile
                                                here. Click save when you're
                                                done.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {portFields.fields.map(
                                            (field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex space-x-4 items-center"
                                                >
                                                    <Label className="w-full">
                                                        Port String:
                                                        <Input
                                                            type="text"
                                                            {...register(
                                                                `ports.${index}`
                                                            )}
                                                            placeholder="8080:80/udp"
                                                        />
                                                    </Label>

                                                    {portFields.fields.length >
                                                        1 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                portFields.remove(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                portFields.append("")
                                            }
                                        >
                                            {" "}
                                            Agregar nueva variable
                                        </Button>
                                        {/* <DialogFooter>
                                            <Button type="submit">
                                                Save changes
                                            </Button>
                                        </DialogFooter> */}
                                    </DialogContent>
                                </Dialog>
                                {envFields.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex space-x-4 items-center"
                                    >
                                        <Label className="w-full">
                                            Nombre:
                                            <Input
                                                type="text"
                                                {...register(
                                                    `env.${index}.name`
                                                )}
                                            />
                                        </Label>
                                        <Label className=" w-full">
                                            Valor:
                                            <Input
                                                type="text"
                                                {...register(
                                                    `env.${index}.value`
                                                )}
                                            />
                                        </Label>
                                        {envFields.fields.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    envFields.remove(index)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <FormDescription>
                                    Cuando el servidor este disponible se creará
                                    el contenedor.
                                </FormDescription>
                                <FormMessage />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
