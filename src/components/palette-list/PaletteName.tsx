'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-solid-svg-icons';

interface PaletteNameProps {
  name: string;
  onChange: (name: string) => void;
  className?: string;
}

export function PaletteName({ name, onChange, className = '' }: PaletteNameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

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
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(name);
            setEditing(false);
          }
        }}
        className={`border-b border-zinc-400 bg-transparent outline-none focus:border-zinc-700 dark:border-zinc-500 dark:focus:border-zinc-300 ${className}`}
      />
    );
  }

  function startEditing() {
    setDraft(name);
    setEditing(true);
  }

  return (
    <span
      className={`group/name flex cursor-pointer items-center gap-1.5 ${className}`}
      onClick={startEditing}
      title="Click to rename"
    >
      {name}
      <FontAwesomeIcon
        icon={faPen}
        className="text-[10px] text-zinc-300 transition-colors group-hover/name:text-zinc-500 dark:text-zinc-600 dark:group-hover/name:text-zinc-400"
      />
    </span>
  );
}
