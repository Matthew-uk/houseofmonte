"use client";

import { Toaster } from "sonner";

export function MonteToaster() {
  return (
    <Toaster
      position="bottom-right"
      gap={8}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "monte-toast !bg-[rgba(13,13,13,0.85)] !backdrop-blur-xl !border !border-[rgba(255,255,255,0.06)] !rounded-[8px] !shadow-[0_8px_32px_rgba(0,0,0,0.4)] !text-text-primary !font-body !text-[0.875rem]",
          title: "!text-text-primary !font-body",
          description: "!text-text-secondary !font-body !text-[0.8rem]",
          success: "!border-l-[3px] !border-l-gold",
          error: "!border-l-[3px] !border-l-gold-muted",
          info: "!border-l-[3px] !border-l-[rgba(255,255,255,0.12)]",
          actionButton:
            "!bg-gold !text-bg-primary !text-[0.75rem] !font-body !tracking-wider !uppercase",
        },
      }}
    />
  );
}
