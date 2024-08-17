import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContainerSchema } from '@/types/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { router } from '@inertiajs/react';
import { GeneralSettings } from './GeneralSettings';
import { AdvancedSettings } from './AdvancedSettings';
import { LocalTabs } from './LocalTabs';
import { TemplateSelector } from './TemplateSelector';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {z} from "zod";
import {Node} from "@/types/node";
//import {ContainerTemplate} from "@/types/container-template";

interface CreateContainerFormProps {
    nodes: Node[];
    templates: any[];
}

export function CreateContainerForm({ nodes, templates }: CreateContainerFormProps) {
    const { toast } = useToast();
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [templateName, setTemplateName] = useState('');
    // @ts-ignore
    const form = useForm({
        resolver: zodResolver(createContainerSchema),
        defaultValues: {
            node: '',
            name: '',
            image: '',
            cmd: '',
            env: [{ name: '', value: '' }],
            ports: [{ hostPort: '', containerPort: '', protocol: 'tcp' }],
            volumes: [{ hostPath: '', containerPath: '' }],
            advanced_bools: ['detach'],
        },
    });

    const onSubmit = (data: z.infer<typeof createContainerSchema>) => {
        const formattedData = {
            node: data.node,
            name: data.name,
            image: data.image,
            attributes: {
                cmd: data.cmd,
                ports: data.ports,
                env: data.env,
                volumes: data.volumes.map(v => (v.hostPath !== '' && v.containerPath !== '') ? `${v.hostPath}:${v.containerPath}` : ''),
                advanced_bools: data.advanced_bools,
            },
        };
        // @ts-ignore
        router.post('/containers/store', formattedData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Container created successfully',
                    description: 'Your container has been created and is being processed.',
                });
                setIsTemplateDialogOpen(true);
            },
            onError: (errors) => {
                toast({
                    title: 'Error creating container',
                    description: 'Please check the form for errors and try again.',
                    variant: 'destructive',
                });
                Object.keys(errors).forEach(key => {
                    form.setError(key as any, {
                        type: 'manual',
                        message: errors[key] as string
                    });
                });
            },
        });
    };

    const onTemplateSelect = (template: any) => {
        form.reset(JSON.parse(template.configuration));
    };

    const saveTemplate = () => {
        const formData = form.getValues();
        router.post('/container-templates', {
            name: templateName,
            configuration: formData,
        }, {
            preserveState: true,

            onSuccess: () => {
                toast({
                    title: 'Template saved successfully',
                    description: 'Your container template has been saved.',
                });
                setIsTemplateDialogOpen(false);
            },
            onError: () => {
                toast({
                    title: 'Error saving template',
                    description: 'There was an error saving your template. Please try again.',
                    variant: 'destructive',
                });
            },
        });
    };

    // noinspection TypeScriptValidateTypes
    return (
        <>
            <Form {...form}>
                {/*// @ts-ignore*/}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <TemplateSelector templates={templates} onSelect={onTemplateSelect} />
                    <LocalTabs>
                        <GeneralSettings form={form} nodes={nodes} />
                        <AdvancedSettings form={form} />
                    </LocalTabs>
                    <Button className="w-full" type="submit">Create Container</Button>
                </form>
            </Form>

            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save as Template</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Enter template name"
                    />
                    <DialogFooter>
                        <Button onClick={saveTemplate}>Save Template</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
