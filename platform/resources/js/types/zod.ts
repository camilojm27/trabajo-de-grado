import {z} from "zod";

export const createContainerSchema = z.object({
    node: z.string().uuid(),
    name: z.string().min(3).max(100),
    image: z.string().min(3).max(100),
    cmd: z.string().min(0).max(1000),
    ports: z.array(z.object({
        hostPort: z.string(),
        containerPort: z.string(),
        protocol: z.enum(['tcp', 'udp'])
    })),
    env: z
        .array(
            z.object({ name: z.string().min(0), value: z.string().min(0) })
        )
        .min(0),
    volumes: z.array(z.object({
        hostPath: z.string(),
        containerPath: z.string()
    })),    advanced_bools: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    networkName: z.string().max(200),
});
