import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import React from "react";
import {PaginationI} from "@/types";

// @ts-ignore
export default function LaraPagination({paginationObject}: { paginationObject: PaginationI }) {
    return (<Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href={paginationObject.prev_page_url ?? undefined} />
            </PaginationItem>
            {paginationObject.links.slice(1, -1).map((link: any, index: any) => (
                <PaginationItem key={index}>
                    <PaginationLink href={link.url ?? undefined} isActive={link.active}>
                        {link.label}
                    </PaginationLink>
                </PaginationItem>
            ))}
            <PaginationItem>
                <PaginationNext href={paginationObject.next_page_url ?? undefined} />
            </PaginationItem>
        </PaginationContent>
    </Pagination>)
}
