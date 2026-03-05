import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { ColumnDef } from "./data-table";
import { Settings2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto hidden h-9 lg:flex gap-2 font-bold border-primary/20 hover:bg-primary/5 transition-all"
        >
          <Settings2 className="h-4 w-4 text-primary" />
          Tampilan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-primary/10">
        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">
          Atur Kolom
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/5" />
        <div className="max-h-[300px] overflow-y-auto p-1">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" &&
                column.getCanHide() &&
                !(column.columnDef as ColumnDef<TData, unknown>).hideFromViewOptions,
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer rounded-lg font-medium focus:bg-primary/5 focus:text-primary transition-colors"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}