import { Card, CardContent } from "@/Components/ui/card";
import { Task } from "@/types/task";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskDescriptionProps = {
  task: Task;
};

export function TaskDescription({ task }: TaskDescriptionProps) {
  return (
    <Card className="overflow-hidden border-primary/10 bg-card/50 shadow-sm backdrop-blur-sm">
      <Accordion type="single" defaultValue="description" collapsible>
        <AccordionItem value="description" className="border-none">
          <CardContent className="p-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight">Deskripsi Tugas</span>
              </div>
            </AccordionTrigger>
            
            <AccordionContent>
              <div className="px-6 pb-6 pt-2">
                {/* Lampiran Gambar jika ada */}
                {task.image_path && (
                  <div className="group relative mb-6 overflow-hidden rounded-xl border border-primary/10 bg-muted">
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <ImageIcon className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                    <img
                      src={task.image_path}
                      alt={task.name}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                )}

                {/* Konten Deskripsi */}
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  {task.description ? (
                    <div 
                      className="text-muted-foreground leading-relaxed selection:bg-primary/20"
                      dangerouslySetInnerHTML={{ __html: task.description }} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-primary/5 rounded-xl">
                      <p className="text-sm italic text-muted-foreground/60">
                        Tidak ada deskripsi yang tersedia untuk tugas ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </CardContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}