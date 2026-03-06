import { Button } from "@/Components/ui/button";
import RichTextEditor from "@/Components/RichTextEditor";
import { useState } from "react";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CommentFormProps = {
  onSubmit: (content: string) => void;
  parentId?: number;
  initialContent?: string;
  submitLabel?: string;
  onCancel?: () => void;
  className?: string;
};

export function CommentForm({
  onSubmit,
  initialContent = "",
  submitLabel = "Kirim Komentar",
  onCancel,
  className,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const strippedContent = content.replace(/<[^>]*>?/gm, "").trim();
    
    if (strippedContent) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("w-full space-y-3 rounded-xl border border-primary/5 bg-card/50 p-1 transition-all focus-within:border-primary/20 focus-within:ring-1 focus-within:ring-primary/10", className)}
    >
      <div className="overflow-hidden rounded-lg">
        <RichTextEditor
          value={content}
          onChange={(value) => setContent(value)}
          placeholder="Tulis komentar atau masukan Anda di sini..."
        />
      </div>
      
      <div className="flex items-center justify-end gap-2 px-1 pb-1">
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
            className="h-9 px-4 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
        )}
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.replace(/<[^>]*>?/gm, "").trim()}
          className="h-9 px-5 font-bold shadow-lg shadow-primary/10 transition-all active:scale-95"
        >
          <Send className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}