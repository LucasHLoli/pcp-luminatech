"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Botão genérico que persiste um valor via server action e atualiza a página.
export default function SaveButton({
  onSave,
  rotulo = "Salvar e recalcular",
}: {
  onSave: () => Promise<void>;
  rotulo?: string;
}) {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        className="btn"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await onSave();
            router.refresh();
            setOk(true);
            setTimeout(() => setOk(false), 2500);
          })
        }
      >
        {pending ? "Salvando…" : rotulo}
      </button>
      {ok && (
        <span className="text-sm font-medium text-emerald-600">
          ✓ Salvo — cascata recalculada
        </span>
      )}
    </div>
  );
}
