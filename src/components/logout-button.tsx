"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { useAppDispatch } from "@/state/redux";
import { api } from "@/state/api";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function LogoutButton({
  asMenuItem = false,
  className,
}: {
  asMenuItem?: boolean;
  className?: string;
}) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = () =>
    startTransition(async () => {
      try {
        const result = await logoutAction();
        dispatch(api.util.resetApiState());
        const channel =
          typeof BroadcastChannel !== "undefined"
            ? new BroadcastChannel("homely-auth")
            : null;
        channel?.postMessage("changed");
        channel?.close();
        if (result?.error) {
          setError(result.error);
        } else {
          router.replace("/login");
          router.refresh();
        }
      } catch {
        setError("Não foi possível confirmar a saída. Tente novamente.");
      }
    });
  return (
    <div>
      {asMenuItem ? (
        <DropdownMenuItem
          closeOnClick={false}
          className={className}
          disabled={pending}
          onClick={handleLogout}
        >
          {pending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      ) : (
        <Button
          variant="outline"
          className={className}
          disabled={pending}
          onClick={handleLogout}
        >
          {pending ? "Saindo..." : "Sair"}
        </Button>
      )}
      {error && (
        <p role="alert" className="max-w-sm text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
