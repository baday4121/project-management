import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumn } from "@/types/kanban";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

type SortableItemProps = {
  id: number;
  children: React.ReactNode;
};

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors",
        isDragging ? "z-50 border-primary bg-primary/5 shadow-lg" : "hover:border-primary/30"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-3 font-medium">
        {children}
      </div>
    </div>
  );
}

type Props = {
  columns: KanbanColumn[];
  projectId: number;
};

export function ReorderColumnsDialog({ columns: initialColumns, projectId }: Props) {
  const [columns, setColumns] = useState(initialColumns);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setColumns((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    const updatedColumns = columns.map((col, index) => ({
      id: col.id,
      order: index,
    }));

    router.post(
      route("kanban.update-columns-order", projectId),
      { columns: updatedColumns },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setOpen(false);
          toast({
            title: "Berhasil",
            description: "Urutan kolom berhasil diperbarui",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "Gagal",
            description: "Gagal memperbarui urutan kolom",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
          <DragHandleDots2Icon className="h-4 w-4 text-primary" />
          Atur Urutan Kolom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col sm:max-w-[450px] border-primary/10">
        <DialogHeader className="px-1">
          <DialogTitle className="text-xl font-bold tracking-tight">Atur Kolom Kanban</DialogTitle>
          <DialogDescription>
            Tarik dan lepas kolom untuk mengubah urutan tampilannya di papan kanban.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 px-1">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={columns} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {columns.map((column) => (
                  <SortableItem key={column.id} id={column.id}>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full shadow-sm",
                        column.color ? `bg-${column.color}-500` : "bg-muted",
                      )}
                    />
                    <span className="text-sm font-semibold tracking-wide">{column.name}</span>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-primary/5">
          <Button variant="ghost" onClick={() => setOpen(false)} className="font-medium">
            Batal
          </Button>
          <Button onClick={handleSave} className="font-bold shadow-lg shadow-primary/20">
            Simpan Urutan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}