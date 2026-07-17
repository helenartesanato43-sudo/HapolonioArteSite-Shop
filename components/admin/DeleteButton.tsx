"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage: string;
}

export function DeleteButton({ action, confirmMessage }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        Remover
      </button>
    </form>
  );
}
