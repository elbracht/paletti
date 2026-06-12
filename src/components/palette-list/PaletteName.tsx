"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-solid-svg-icons";

interface PaletteNameProps {
  name: string;
  onChange: (name: string) => void;
  className?: string;
}

export function PaletteName({
  name,
  onChange,
  className = "",
}: PaletteNameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed) onChange(trimmed);
    else setDraft(name);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(name);
            setEditing(false);
          }
        }}
        className={`bg-transparent outline-none border-b border-zinc-400 focus:border-zinc-700 ${className}`}
      />
    );
  }

  return (
    <span
      className={`group/name flex items-center gap-1.5 cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
      title="Click to rename"
    >
      {name}
      <FontAwesomeIcon
        icon={faPen}
        className="text-zinc-300 group-hover/name:text-zinc-500 transition-colors text-[10px]"
      />
    </span>
  );
}
