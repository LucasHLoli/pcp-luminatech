"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { restaurar } from "@/app/actions";

export default function RestaurarBotao() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn-ghost"
      disabled={pending}
      onClick={() => {
        if (!confirm("Restaurar todos os dados para os valores da LUX-01?"))
          return;
        start(async () => {
          await restaurar();
          router.refresh();
        });
      }}
    >
      {pending ? "Restaurando…" : "↺ Restaurar dados LUX-01"}
    </button>
  );
}
