import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon, Filter, FilterX, Search, Calendar as CalendarIcon } from "lucide-react";
import { CalendarDatePicker } from "../ui/calendar-datetime-picker";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
  queryParams: QueryParams;
  routeName: string;
  entityId?: string | number;
  isLoading: boolean;
  onFilter: (name: string, value: string | string[]) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
  queryParams,
  routeName,
  entityId,
  isLoading,
  onFilter,
  onReset,
}: DataTableToolbarProps<TData>) {
  const excludedParams = ["page", "per_page", "tab"];
  const isFiltered = Object.keys(queryParams).some(
    (param) => !excludedParams.includes(param),
  );

  const [dateRanges, setDateRanges] = useState<{
    [key: string]: { from: Date; to: Date };
  }>(
    filterableColumns
      .filter((col) => col.filterType === "date")
      .reduce(
        (acc, col) => {
          acc[col.accessorKey] = {
            from: new Date(new Date().getFullYear(), 0, 1),
            to: new Date(),
          };
          return acc;
        },
        {} as { [key: string]: { from: Date; to: Date } },
      ),
  );

  const [showAllFilters, setShowAllFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const textInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const previousValues = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    previousValues.current = Object.keys(queryParams).reduce(
      (acc, key) => {
        if (typeof queryParams[key] === "string") {
          acc[key] = queryParams[key] as string;
        }
        return acc;
      },
      {} as { [key: string]: string },
    );
  }, [queryParams]);

  const updateQuery = (name: string, value: string | string[]) => {
    const updatedParams = {
      ...queryParams,
      [name]: value,
      page: queryParams.page || 1,
    };

    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete updatedParams[name];
    }

    if (entityId) updatedParams.entityId = entityId;

    router.get(route(routeName, { id: entityId }), updatedParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDateSelect = (accessorKey: string, { from, to }: { from: Date; to: Date }) => {
    setDateRanges((prev) => ({ ...prev, [accessorKey]: { from, to } }));
    updateQuery(accessorKey, [from.toISOString(), to.toISOString()]);
  };

  const handleTextInputChange = (accessorKey: string, value: string) => {
    if (previousValues.current[accessorKey] === value) return;
    previousValues.current[accessorKey] = value;
    onFilter(accessorKey, value);
  };

  const handleReset = () => {
    Object.values(textInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
    setIsReset(true);
    onReset();
    setShowAllFilters(false);
    setTimeout(() => setIsReset(false), 100);
  };

  const activeFilterableColumns = filterableColumns.filter((col) => !col.excludeFromTable);
  const shouldShowAllFiltersButton = isMobile || activeFilterableColumns.length > 3;

  const visibleFilters = showAllFilters || isMobile
    ? activeFilterableColumns
    : activeFilterableColumns.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sisi Kiri: Filter */}
        <div className={cn(
          "flex flex-1 flex-wrap items-center gap-2 transition-all duration-300",
          isMobile && !showAllFilters ? "hidden" : "flex"
        )}>
          {visibleFilters.map((column) => {
            if (column.filterType === "text") {
              return (
                <div key={column.accessorKey} className="relative">
                  <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder={`Cari ${column.title}...`}
                    defaultValue={queryParams[column.accessorKey] || ""}
                    disabled={isLoading}
                    ref={(el) => (textInputRefs.current[column.accessorKey] = el)}
                    onBlur={(e) => handleTextInputChange(column.accessorKey, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTextInputChange(column.accessorKey, (e.target as HTMLInputElement).value)}
                    className="h-8 w-[180px] pl-7 lg:w-[200px] text-xs shadow-sm"
                  />
                </div>
              );
            }

            if (column.filterType === "select" && column.options) {
              return (
                <DataTableFacetedFilter
                  key={column.accessorKey}
                  column={table.getColumn(column.accessorKey)}
                  title={column.title}
                  options={column.options}
                  onSelect={(values) => onFilter(column.accessorKey, values)}
                  initialSelectedValues={queryParams[column.accessorKey] || []}
                  disabled={isLoading}
                  isReset={isReset}
                />
              );
            }

            if (column.filterType === "date") {
              return (
                <div key={column.accessorKey} className="flex items-center gap-1">
                  <CalendarDatePicker
                    date={dateRanges[column.accessorKey]}
                    onDateSelect={(range) => handleDateSelect(column.accessorKey, range)}
                    className="h-8 text-xs font-bold"
                    variant="outline"
                  />
                </div>
              );
            }
            return null;
          })}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={isLoading}
              className="h-8 px-2 text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Atur Ulang
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sisi Kanan: Aksi & Opsi */}
        <div className="flex items-center gap-2 ml-auto">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="destructive" size="sm" className="h-8 text-xs font-bold animate-in zoom-in">
              <TrashIcon className="mr-2 h-3 w-3" />
              Hapus ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}

          {shouldShowAllFiltersButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllFilters(!showAllFilters)}
              className={cn(
                "h-8 text-xs font-bold transition-all",
                showAllFilters ? "bg-muted" : "bg-background"
              )}
            >
              {showAllFilters ? (
                <>Sembunyikan Filter <FilterX className="ml-2 h-3 w-3" /></>
              ) : (
                <>Semua Filter <Filter className="ml-2 h-3 w-3" /></>
              )}
            </Button>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}