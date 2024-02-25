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
import { Checkbox } from '@/components/ui/checkbox';

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
        volumes: z.array(z.string().min(0)).min(0),
        avanced_bools: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
            }),
    });

    //TODO: Eliminar los valores de prueba
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            node: "9b5acc36-e6a5-4ab2-81f4-9edca73a165b",
            name: "Hola Mundo",
            image: "ubuntu:24.04",
            ports: [],
            env: [{ name: "holapp", value: "mundoo" }],
            volumes: [],
            avanced_bools: ["detach"],
        },
    });

  const { register, control, handleSubmit, setError, formState: { errors } } = form

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        const t = {
            node: data.node,
            name: data.name,
            image: data.image,
            attributes: {
                ports: data.ports,
                env: data.env,
                volumes: data.volumes,
                avanced_bools: data.avanced_bools,
            },
        };

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(t, null, 2)}
                    </code>
                </pre>
            ),
        });
        router.post("/containers/store", t);
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
        volumsFields.append("");
    }

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
                                <LocalTabs>
                                    <section>
                                        <FormField
                                            control={form.control}
                                            name="node"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="w-full">
                                                        Selecciona el nodo donde
                                                        quieres crear el
                                                        contenedor:
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[320px]">
                                                            <SelectValue placeholder="Seleccionar un nodo" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {nodes &&
                                                                nodes.map(
                                                                    (
                                                                        node,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
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
                                                            {
                                                                errors.image
                                                                    .message
                                                            }
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
                                                        Nombre del Contenedor
                                                        (nombre que deseas
                                                        darle)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Noble Numbat"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {errors.name && (
                                                        <div className="text-red-600">
                                                            {
                                                                errors.name
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="mt-4 mr-2"
                                                >
                                                    Variables de entorno
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[725px] ">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Agregar Variables de
                                                        entorno
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta architecto officiis, quaerat quas veniam alias vel!
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
                                                            {envFields.fields
                                                                .length > 1 && (
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
                                                        Make changes to your
                                                        profile here. Click save
                                                        when you're done.
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

                                                            {portFields.fields
                                                                .length > 1 && (
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
                                                <DialogFooter>
                                                    <Button type="submit">
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <FormItem>
                                            <FormLabel>
                                                Volumenes
                                                <FormDescription>
                                                    Agrega los volumenes que
                                                    necesitará el contenedor.
                                                </FormDescription>
                                            </FormLabel>
                                            {volumsFields.fields.map(
                                                (field, index) => (
                                                    <div
                                                        key={field.id}
                                                        className="flex space-x-4 items-center"
                                                    >
                                                        <Label className="w-full">
                                                            <Input
                                                                type="text"
                                                                {...register(
                                                                    `volumes.${index}`
                                                                )}
                                                                placeholder="myapp:/usr/share/nginx/html"
                                                            />
                                                        </Label>
                                                        {volumsFields.fields
                                                            .length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    volumsFields.remove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                volumsFields.append(
                                                                    ""
                                                                )
                                                            }
                                                        >
                                                            {" "}
                                                            Agregar nuevo
                                                            volumen
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </FormItem>
                                        <FormDescription>
                                            Cuando el servidor este disponible
                                            se creará el contenedor.
                                        </FormDescription>
                                        <FormMessage />
                                    </section>
                                    <section>
                                        <FormField
                                            control={form.control}
                                            name="avanced_bools"
                                            render={() => (
                                                <FormItem>
                                                    <div className="mb-4">
                                                        <FormLabel className="text-base">
                                                            Activar o desactivar
                                                            opciones
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Selecciona las
                                                            opciones que deseas
                                                            tener activas en el
                                                            contenedor
                                                        </FormDescription>
                                                    </div>
                                                    {items.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={
                                                                form.control
                                                            }
                                                            name="avanced_bools"
                                                            render={({
                                                                field,
                                                            }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(
                                                                                    item.id
                                                                                )}
                                                                                onCheckedChange={(
                                                                                    checked
                                                                                ) => {
                                                                                    return checked
                                                                                        ? field.onChange(
                                                                                              [
                                                                                                  ...field.value,
                                                                                                  item.id,
                                                                                              ]
                                                                                          )
                                                                                        : field.onChange(
                                                                                              field.value?.filter(
                                                                                                  (
                                                                                                      value
                                                                                                  ) =>
                                                                                                      value !==
                                                                                                      item.id
                                                                                              )
                                                                                          );
                                                                                }}
                                                                                disabled={
                                                                                    item.id ===
                                                                                    "detach"
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </section>
                                </LocalTabs>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LocalTabs({children}: {children: React.ReactNode}) {
    return (
        <Tabs defaultValue="general" className="">
            <h3 className="text-2xl font-semibold mb-4 text-center">
                Crear Contenedor
            </h3>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="advanced">Avanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        {/* <CardTitle>General</CardTitle> */}
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent className="">{children[0]}</CardContent>
                    <CardFooter>
                        <Button type='submit'>Crear Contenedor</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="advanced">
                <Card>
                    <CardHeader>
                        {/* <CardTitle>Avanced</CardTitle> */}
                        <CardDescription>
                            Configura ajustes avanzados para el contenedor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="">{children[1]}</CardContent>
                    <CardFooter>
                        <Button type='submit'>Crear Contenedor</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
