"use client";

import { useEffect, useCallback } from "react";

type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
};

export const useKeyboardShortcut = (
    combo: KeyCombo,
    callback: (event: KeyboardEvent) => void,
    dependencies: any[] = []
) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!event.key || !combo.key) return;

            const { ctrlKey, shiftKey, altKey, metaKey } = event;
            const key = event.key;

            const matchKey = key.toLowerCase() === combo.key.toLowerCase();
            const matchCtrl = !!combo.ctrlKey === (ctrlKey || metaKey);
            const matchShift = !!combo.shiftKey === shiftKey;
            const matchAlt = !!combo.altKey === altKey;

            if (matchKey && matchCtrl && matchShift && matchAlt) {
                event.preventDefault();
                callback(event);
            }
        },
        [combo, callback, ...dependencies]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
};
