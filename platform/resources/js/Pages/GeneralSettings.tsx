import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Settings from "@/Layouts/Settings";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {PageProps} from "@/types";
import {Setting as SettingsI} from "@/types/setting";
import {Pagination as PaginationI} from "@/types/";

export default function GeneralSettings({ auth, settings }: PageProps<{ settings: PaginationI }>) {
    console.log(settings)
    const [editingConfig, setEditingConfig] = useState(0);
    const { data, setData, patch, processing } = useForm({
        key: '',
        value: '',
    });

    const handleEdit = (config: SettingsI) => {
        setEditingConfig(config.id);
        setData({ key: config.key, value: config.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        patch(route('settings.update', editingConfig), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setEditingConfig(0),
        });
    };

    return (
        <Settings auth={auth}>
            {settings.data.map(config => (
                <Card key={config.id}>
                    <CardHeader>
                        <CardTitle>{config.key}</CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Input
                                placeholder={config.key}
                                defaultValue={config.value}
                                onChange={(e) => setData('value', e.target.value)}
                                disabled={editingConfig !== config.id}
                            />
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        {editingConfig === config.id ? (
                            <Button type="submit" onClick={handleSubmit} disabled={processing}>
                                Save
                            </Button>
                        ) : (
                            <Button onClick={() => handleEdit(config)}>Edit</Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href={settings.prev_page_url ?? undefined} />
                    </PaginationItem>
                    {settings.links.slice(1, -1).map((link, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink href={link.url ?? undefined} isActive={link.active}>
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href={settings.next_page_url ?? undefined} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </Settings>
    );
}
