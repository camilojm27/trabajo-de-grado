import React from 'react';
import {UseFormReturn, useFieldArray} from 'react-hook-form';
import {FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Trash2} from 'lucide-react';
import {Node} from '@/types/node';

interface GeneralSettingsProps {
    form: UseFormReturn<any>;
    nodes: Node[];
}

export function GeneralSettings({form, nodes}: GeneralSettingsProps) {
    const {control, register} = form;
    const envFields = useFieldArray({control, name: 'env'});
    const portFields = useFieldArray({control, name: 'ports'});
    const volumeFields = useFieldArray({control, name: 'volumes'});

    return (
        <section className="space-y-6">
            <FormField
                control={control}
                name="node"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Node</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a node"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {nodes.map((node) => (
                                    <SelectItem key={node.id} value={node.id}>
                                        {/*// @ts-ignore*/}
                                        {node.hostname || node.id}  <small>{ JSON.parse(node.attributes).hardware.cores} cores</small>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>Select the node where you want to create the container.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="image"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Imagen</FormLabel>
                        <FormControl>
                            <Input placeholder="ubuntu:24.04" {...field} />
                        </FormControl>
                        <FormDescription>
                            Nombre de la imagen Docker a utilizar.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Nombre del Contenedor</FormLabel>
                        <FormControl>
                            <Input placeholder="Noble Numbat" {...field} />
                        </FormControl>
                        <FormDescription>
                            Un nombre único para identificar tu contenedor.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="cmd"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Comando</FormLabel>
                        <FormControl>
                            <Input placeholder="tail -f /dev/null" {...field} />
                        </FormControl>
                        <FormDescription>
                            El comando a ejecutar cuando el contenedor inicie.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            {/* Environment Variables */}
            <FormItem>
                <FormLabel>Environment Variables</FormLabel>
                {envFields.fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-4 items-center mb-2">
                        <FormControl>
                            <Input {...register(`env.${index}.name`)} placeholder="Name"/>
                        </FormControl>
                        <FormControl>
                            <Input {...register(`env.${index}.value`)} placeholder="Value"/>
                        </FormControl>
                        {envFields.fields.length > 1 && (
                            <Button type="button" variant="secondary" onClick={() => envFields.remove(index)}>
                                <Trash2/>
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => envFields.append({name: '', value: ''})}>
                    Add Variable
                </Button>
                <FormDescription>Define environment variables for your container.</FormDescription>
            </FormItem>

            <FormField
                control={control}
                name="networkName"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Network</FormLabel>
                        <FormControl>
                            <Input placeholder="network name" {...field} />
                        </FormControl>
                        <FormDescription>
                            Write the name of your network, if the network does not exists it will be created on <strong>bridge</strong> mode
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />
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
                                <SelectValue placeholder="Protocol"/>
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
                                <Trash2/>
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => portFields.append({hostPort: '', containerPort: '', protocol: 'tcp'})}
                >
                    Add Port Mapping
                </Button>
            </FormItem>
            <FormItem>
                <FormLabel>Volumes</FormLabel>
                <FormDescription>
                    Mapea los volumenes del host al contenedor (hostPath:containerPath)
                </FormDescription>
                {volumeFields.fields.map((field, index) => (
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
                        {volumeFields.fields.length > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => volumeFields.remove(index)}
                            >
                                <Trash2/>
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => volumeFields.append({hostPath: '', containerPath: ''})}
                >
                    Add Volume
                </Button>
            </FormItem>
        </section>
    );
}
