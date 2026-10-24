"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, useGetSessionQuery } from "@/state/api";
import { useAppDispatch } from "@/state/redux";

export default function SessionSync() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetSessionQuery(undefined, {
    pollingInterval: 60_000,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const previous = useRef<string | undefined>(undefined);
  useEffect(() => {
    void refetch();
  }, [pathname, refetch]);
  useEffect(() => {
    if (!data) return;
    const identity = JSON.stringify(data.user);
    if (previous.current !== undefined && previous.current !== identity) {
      dispatch(api.util.resetApiState());
      router.refresh();
      const channel =
        typeof BroadcastChannel !== "undefined"
          ? new BroadcastChannel("homely-auth")
          : null;
      channel?.postMessage("changed");
      channel?.close();
    }
    previous.current = identity;
  }, [data, dispatch, router]);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel("homely-auth");
    channel.onmessage = () => {
      void refetch();
    };
    return () => channel.close();
  }, [refetch]);
  return null;
}
