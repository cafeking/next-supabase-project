"use client";

import { useEffect, useState } from "react";
import { Note, getNotes, deleteNote } from "@/lib/supabase/notes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface NotesListProps {
  refresh?: boolean;
  onRefreshComplete?: () => void;
}

export function NotesList({ refresh = false, onRefreshComplete }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 조회에 실패했습니다");
    } finally {
      setLoading(false);
      onRefreshComplete?.();
    }
  };

  useEffect(() => {
    loadNotes();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!confirm("이 메모를 삭제하시겠습니까?")) return;

    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 삭제에 실패했습니다");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (notes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">아직 메모가 없습니다</div>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card key={note.id} className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg break-words">{note.title}</h3>
              {note.content && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 whitespace-pre-wrap">
                  {note.content}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(note.created_at).toLocaleString("ko-KR")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(note.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
