"use client";

import { useState } from "react";
import { createNote } from "@/lib/supabase/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteFormProps {
  onNoteAdded?: () => void;
}

export function NoteForm({ onNoteAdded }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createNote(title, content);
      setTitle("");
      setContent("");
      onNoteAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="w-full"
        />
      </div>
      <div>
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          className="w-full p-2 border rounded-md min-h-24 bg-background text-foreground"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "저장 중..." : "메모 저장"}
      </Button>
    </form>
  );
}
