export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    is_admin: boolean
    is_banned: boolean
    ip: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationI<T> {
    current_page: number,
    data: T[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Link[],
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number,
}
