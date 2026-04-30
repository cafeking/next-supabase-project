"use client";

import { useState } from "react";
import { NoteForm } from "@/components/note-form";
import { NotesList } from "@/components/notes-list";
import { Card } from "@/components/ui/card";

export default function ProtectedPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNoteAdded = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">메모 앱</h1>
        <p className="text-muted-foreground">간단하고 빠른 메모 작성</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="font-bold text-xl mb-4">새 메모</h2>
            <NoteForm onNoteAdded={handleNoteAdded} />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="font-bold text-xl mb-4">메모 목록</h2>
            <NotesList refresh={refreshTrigger} onRefreshComplete={() => {}} />
          </Card>
        </div>
      </div>
    </div>
  );
}
