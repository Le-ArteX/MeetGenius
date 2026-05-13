"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../../../components/dashboard/dashboard";
import NoteDetails from "../../../components/notes/NoteDetails";

export default function Page() {
  const params = useParams();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try to get ID from params
    const slug = params?.slug;
    const idFromParams = Array.isArray(slug) ? slug[0] : slug;
    
    // 2. Fallback: Parse directly from window.location
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const idFromPath = pathParts.length > 1 && pathParts[0] === 'dashboard' ? pathParts[1] : null;

    const finalId = idFromParams || idFromPath;
    
    const reservedKeywords = ["workspaces", "billing", "settings", "new", "mynotes"];
    if (finalId && !reservedKeywords.includes(finalId)) {
      setActiveId(finalId);
    } else {
      setActiveId(null);
    }
  }, [params]);

  if (activeId) {
    return <NoteDetails noteId={activeId} />;
  }

  return <Dashboard />;
}
