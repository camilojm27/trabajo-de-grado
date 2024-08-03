import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {router} from '@inertiajs/react'
import { Label } from '@radix-ui/react-dropdown-menu';
import { Trash2 } from 'lucide-react';
import { User } from '@/types';
import {Node} from "@/types/node"
import { Checkbox } from '@/components/ui/checkbox';
import React from "react";
import {createContainerSchema} from "@/types/zod";

interface Props {
    auth: {
        user: User
    }
    nodes: Node[]
}

export default function Create({auth, nodes}: Props) {
const { toast } = useToast()

const items = [
    {
        id: "auto_remove",
        label: "Autoremove",
    },
    {
        id: "detach",
        label: "Detach",
    },
    {
        id: "network_disabled",
        label: " Disable networking",
    },
    {
        id: "oom_kill_disable",
        label: "Disable OOM killer",
    },
    {
        id: "privileged",
        label: "Privileged",
    },
    {
        id: "remove",
        label: "Remove",
    },
    {
        id: "read_only",
        label: "Read Only",
    }
] as const;



    //TODO: Eliminar los valores de prueba
    const form = useForm<z.infer<typeof createContainerSchema>>({
        resolver: zodResolver(createContainerSchema),
        defaultValues: {
            node: "",
            name: "",
            image: "",
            cmd: "",
            env: [{ name: "", value: "" }],
            ports: [{ hostPort: '', containerPort: '', protocol: 'tcp' }],
            volumes: [{ hostPath: '', containerPath: '' }],
            advanced_bools: ["detach"],
        },
    });

  const { register, control, handleSubmit, setError, formState: { errors } } = form

    function onSubmit(data: z.infer<typeof createContainerSchema>) {
        // setIsSubmitting(true)

        const formattedData = {
            node: data.node,
            name: data.name,
            image: data.image,
            attributes: {
                cmd: data.cmd,
                ports: data.ports,
                env: data.env,
                volumes: data.volumes.map(v => (v.hostPath !== "" && v.containerPath !== "") ? `${v.hostPath}:${v.containerPath}` : ""),
                advanced_bools: data.advanced_bools,
            },
        }

        router.post("/containers/store", formattedData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (props) => {
                console.log(props.props)
                // setIsSubmitting(false)
                toast({
                    title: "Container created successfully",
                    description: "Your container has been created and is being processed.",
                })
                //TODO: REDIRECT

                // Optionally, reset the form or redirect
                form.reset()
                // router.visit('/containers')
            },
            onError: (errors) => {
                // setIsSubmitting(false)
                toast({
                    title: "Error creating container",
                    description: "Please check the form for errors and try again.",
                    variant: "destructive",
                })
                // Set errors on the form
                Object.keys(errors).forEach(key => {
                    form.setError(key as any, {
                        type: "manual",
                        message: errors[key] as string
                    })
                })
            },
        })
    }

    const envFields = useFieldArray({
    control,
    name: 'env',
  });

    const portFields = useFieldArray({
        control,
        name: 'ports',
    });

    const volumsFields = useFieldArray({
        control,
        name: "volumes",
    });

    if (volumsFields.fields.length === 0) {
        // @ts-ignore
        volumsFields.append("");
    }
    if (portFields.fields.length === 0) {
        // @ts-ignore
        portFields.append("");
    }
    if (envFields.fields.length === 0) {
        // @ts-ignore
        envFields.append("");
    }

    // @ts-ignore
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Link href="/containers">
                    <Button variant="outline">Lista de contenedores</Button>
                </Link>
            }
        >
            <Head title="Create Container" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
                                <LocalTabs>
                                    <section className="space-y-6">
                                        <FormField
                                            control={control}
                                            name="node"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nodo</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccionar un nodo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {nodes.map((node) => (
                                                                <SelectItem key={node.id} value={node.id}>
                                                                    {node.hostname || node.id}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Selecciona el nodo donde quieres crear el contenedor.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="image"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Imagen</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ubuntu:24.04" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Nombre de la imagen Docker a utilizar.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre del Contenedor</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Noble Numbat" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Un nombre único para identificar tu contenedor.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="cmd"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Comando</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="tail -f /dev/null" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        El comando a ejecutar cuando el contenedor inicie.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormItem>
                                            <FormLabel>Variables de Entorno</FormLabel>
                                            {envFields.fields.map((field, index) => (
                                                <div key={field.id} className="flex space-x-4 items-center mb-2">
                                                    <FormControl>
                                                        <Input
                                                            {...form.register(`env.${index}.name`)}
                                                            placeholder="Nombre"
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <Input
                                                            {...form.register(`env.${index}.value`)}
                                                            placeholder="Valor"
                                                        />
                                                    </FormControl>
                                                    {envFields.fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => envFields.remove(index)}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => envFields.append({ name: "", value: "" })}
                                            >
                                                Agregar Variable
                                            </Button>
                                            <FormDescription>
                                                Define las variables de entorno para tu contenedor.
                                            </FormDescription>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel>Puertos</FormLabel>
                                            <FormDescription>
                                                Mapea los puertos del contenedor a los del host (hostPort:containerPort/protocol)
                                            </FormDescription>
                                            {portFields.fields.map((field, index) => (
                                                <div key={field.id} className="flex space-x-4 items-center mb-2">
                                                    <Input
                                                        type="text"
                                                        {...register(`ports.${index}.hostPort`)}
                                                        placeholder="Host Port"
                                                        className="w-1/4"
                                                    />
                                                    <span>:</span>
                                                    <Input
                                                        type="text"
                                                        {...register(`ports.${index}.containerPort`)}
                                                        placeholder="Container Port"
                                                        className="w-1/4"
                                                    />
                                                    <Select
                                                        {...register(`ports.${index}.protocol`)}
                                                        defaultValue="tcp"
                                                    >
                                                        <SelectTrigger className="w-1/4">
                                                            <SelectValue placeholder="Protocol" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="tcp">TCP</SelectItem>
                                                            <SelectItem value="udp">UDP</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {portFields.fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => portFields.remove(index)}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => portFields.append({ hostPort: '', containerPort: '', protocol: 'tcp' })}
                                            >
                                                Add Port Mapping
                                            </Button>
                                        </FormItem>
                                        <FormItem>
                                            <FormLabel>Volumes</FormLabel>
                                            <FormDescription>
                                                Mapea los volumenes del host al contenedor (hostPath:containerPath)
                                            </FormDescription>
                                            {volumsFields.fields.map((field, index) => (
                                                <div key={field.id} className="flex space-x-4 items-center mb-2">
                                                    <Input
                                                        type="text"
                                                        {...register(`volumes.${index}.hostPath`)}
                                                        placeholder="Host Path"
                                                        className="w-1/2"
                                                    />
                                                    <span>:</span>
                                                    <Input
                                                        type="text"
                                                        {...register(`volumes.${index}.containerPath`)}
                                                        placeholder="Container Path"
                                                        className="w-1/2"
                                                    />
                                                    {volumsFields.fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => volumsFields.remove(index)}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => volumsFields.append({ hostPath: '', containerPath: '' })}
                                            >
                                                Add Volume
                                            </Button>
                                        </FormItem>
                                    </section>
                                    <section>
                                        <FormField
                                            control={control}
                                            name="advanced_bools"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel className="text-base">Opciones Avanzadas</FormLabel>
                                                    <FormDescription>
                                                        Selecciona las opciones avanzadas para el contenedor.
                                                    </FormDescription>
                                                    <div className="space-y-4 mt-4">
                                                        {items.map((item) => (
                                                            <FormField
                                                                control={control}
                                                                name="advanced_bools"
                                                                render={({ field }) => {
                                                                    return (
                                                                        <FormItem
                                                                            key={item.id}
                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                        >
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(item.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...field.value, item.id])
                                                                                            : field.onChange(field.value?.filter((value) => value !== item.id));
                                                                                    }}
                                                                                    disabled={item.id === "detach"}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal">
                                                                                {item.label}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    );
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </section>
                                </LocalTabs>
                                <Button className="w-full" type="submit">Crear Contenedor</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LocalTabs({children}: {children: React.ReactNode[]}) {
    return (
        <Tabs defaultValue="general" className="w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">
                Crear Contenedor
            </h3>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardDescription>Configuración general del contenedor</CardDescription>
                    </CardHeader>
                    <CardContent>{children[0]}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="advanced">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Configura ajustes avanzados para el contenedor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{children[1]}</CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
