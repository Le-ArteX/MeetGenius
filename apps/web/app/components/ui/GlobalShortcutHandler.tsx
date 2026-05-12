"use client";

import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "../../hooks/use-keyboard-shortcut";

export const GlobalShortcutHandler = () => {
  const router = useRouter();

  // Ctrl + , -> Settings
  useKeyboardShortcut({ key: ",", ctrlKey: true }, () => {
    router.push("/dashboard/settings");
  });

  // Ctrl + N -> New Note (Redirect to dashboard where the "New Note" action usually lives)
  useKeyboardShortcut({ key: "n", ctrlKey: true }, () => {
    router.push("/dashboard?action=new-note");
  });

  // Ctrl + K -> Search (Focus search bar if on dashboard, or redirect)
  useKeyboardShortcut({ key: "k", ctrlKey: true }, () => {
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.focus();
    } else {
      router.push("/dashboard?focus=search");
    }
  });

  return null; // This component doesn't render anything
};
