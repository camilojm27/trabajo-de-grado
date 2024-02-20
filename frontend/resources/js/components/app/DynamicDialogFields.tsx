import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";

interface Props {
    form: UseFormReturn
}

export default function DynamicDialogFields({ form }: Props) {

    const { register, control, handleSubmit, setError, formState: { errors } } = form

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'env',
      });

    return (
        
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Variables de entorno</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Agregar Variables de entorno</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-4 items-center">
                        <Label className="w-full">
                            Nombre:
                            <Input type="text" {...field} defaultValue=""/>
                        </Label>
                        <Label className="w-full">
                            Valor:
                            <Input type="text" {...field} defaultValue=""/>
                        </Label>
                        {fields.length > 1 && (
                            <Button type="button" onClick={()=> remove(index)}>
                                <Trash2 />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" onClick={()=> append({
                    name: "", value: ""
                })}>
                    Agregar
                </Button>
            </DialogContent>
        </Dialog>
    );
}
