import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface TemplateSelectorProps {
    templates: any[];
    onSelect: (template: any) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    return (
        <FormField
            name="template"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Select Template (Optional)</FormLabel>
                    <Select onValueChange={(value) => {
                        const template = templates.find(t => t.id.toString() === value);
                        if (template) onSelect(template);
                    }}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a template or start from scratch" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
}
