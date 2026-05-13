"use client";

import { useParams } from "next/navigation";
import NoteDetails from "../../../components/notes/NoteDetails";

export default function Page() {
  const { id } = useParams();
  const noteId = Array.isArray(id) ? id[0] : id;

  return <NoteDetails noteId={noteId} />;
}
