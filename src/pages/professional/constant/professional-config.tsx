import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";
import {
    type Professional,
    type ProfessionalResponse,
    professionalSchema,
} from "../schema-types/professional-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_URL as string;

interface GetProfessionalColumnsProps {
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    currentSortBy?: string;
    currentSortOrder?: "asc" | "desc";
    onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getProfessionalColumns({
    onEdit,
    onDelete,
    currentSortBy,
    currentSortOrder,
    onSortChange,
}: GetProfessionalColumnsProps): ColumnDef<ProfessionalResponse>[] {
    return [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <ServerDataTableColumnHeader
                    column={column}
                    title="ID"
                    sortable={true}
                    currentSortBy={currentSortBy}
                    currentSortOrder={currentSortOrder}
                    onSortChange={onSortChange}
                />
            ),
        },
        {
            accessorKey: "profileImage",
            header: () => <div>Profile Image</div>,
            cell: ({ row }) => {
                const profileImage = row.getValue("profileImage") as string;
                const name = row.getValue("name") as string;

                return (
                    <Avatar>
                        <AvatarImage
                            src={`${baseUrl}/${profileImage}`}
                            alt={name}
                            className="grayscale"
                        />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <ServerDataTableColumnHeader
                    column={column}
                    title="Name"
                    sortable={true}
                    currentSortBy={currentSortBy}
                    currentSortOrder={currentSortOrder}
                    onSortChange={onSortChange}
                />
            ),
        },
        {
            id: "category",
            accessorFn: (row) => row.category?.name ?? "",
            header: () => <div>Category</div>,
        },
        {
            id: "subCategory",
            accessorFn: (row) => row.subCategory?.name ?? "",
            header: () => <div>Sub Category</div>,
        },
        {
            id: "state",
            accessorFn: (row) => row.state?.name ?? "",
            header: () => <div>State</div>,
        },

        {
            id: "district",
            accessorFn: (row) => row.district?.name ?? "",
            header: () => <div>District</div>,
        },
        {
            id: "actions",
            header: () => (
                <div className="font-medium">Actions</div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DataTableRowActions<ProfessionalResponse>
                        row={row}
                        onEdit={(professional) => onEdit(Number(professional.id))}
                        onDelete={(professional) => onDelete?.(Number(professional.id))}
                    />

                    <div>
                        <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ),
        },
    ];
}

export const searchColumns = professionalSchema.keyof().options as (keyof Professional)[];
