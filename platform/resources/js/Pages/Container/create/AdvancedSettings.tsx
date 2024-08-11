import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

const advancedOptions = [
    { id: 'auto_remove', label: 'Autoremove' },
    { id: 'detach', label: 'Detach' },
    { id: 'network_disabled', label: 'Disable networking' },
    { id: 'oom_kill_disable', label: 'Disable OOM killer' },
    { id: 'privileged', label: 'Privileged' },
    { id: 'remove', label: 'Remove' },
    { id: 'read_only', label: 'Read Only' },
];

interface AdvancedSettingsProps {
    form: UseFormReturn<any>;
}

export function AdvancedSettings({ form }: AdvancedSettingsProps) {
    const { control } = form;

    return (
        <section>
            <FormField
                control={control}
                name="advanced_bools"
                render={() => (
                    <FormItem>
                        <FormLabel className="text-base">Advanced Options</FormLabel>
                        <FormDescription>Select advanced options for the container.</FormDescription>
                        <div className="space-y-4 mt-4">
                            {advancedOptions.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={control}
                                    name="advanced_bools"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        const updatedValue = checked
                                                            ? [...field.value, item.id]
                                                            : field.value?.filter((value: string) => value !== item.id);
                                                        field.onChange(updatedValue);
                                                    }}
                                                    disabled={item.id === 'detach'}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </section>
    );
}
