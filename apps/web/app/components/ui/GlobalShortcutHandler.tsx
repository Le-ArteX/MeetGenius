'use client';

import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut";

export const GlobalShortcutHandler = () => {
  const router = useRouter();

  // Ctrl + , -> Settings
  useKeyboardShortcut({ key: ",", ctrlKey: true }, () => {
    router.push("/dashboard/settings");
  });

  // Ctrl + N -> New Note
  useKeyboardShortcut({ key: "n", ctrlKey: true }, () => {
    router.push("/dashboard?action=new-note");
  });

  // Ctrl + K -> Search 
  useKeyboardShortcut({ key: "k", ctrlKey: true }, () => {
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.focus();
    } else {
      router.push("/dashboard?focus=search");
    }
  });

  return null;
};
